import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book",
  password: "postgres",
  port: 5432,
});
db.connect();

let book = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const query = "SELECT * FROM book ORDER BY score DESC";
  try {
    const result = await db.query(query);
    book = result.rows;
    // console.log(book);
  } catch (err) {
    console.log(err);
  }
  res.render("index.ejs", {
    books: book,
    decider: "score",
  });
});
app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/edit", async (req, res) => {
  console.log("call from add1");

  const bookName = req.body.bookName;
  const authorName = req.body.authorName;
  const isbn = req.body.isbn;
  const date = req.body.date;
  const score = req.body.score;
  const bookNotes = req.body.bookNotes;
  const myNotes = req.body.myNotes;

  res.render("add2.ejs", {
    bookName: bookName,
    authorName: authorName,
    isbn: isbn,
    date: date,
    score: score,
    bookNotes: bookNotes,
    myNotes: myNotes,
  });
});

app.post("/edit2", async (req, res) => {
  console.log("call from add1");

  const bookName = req.body.bookName;
  const authorName = req.body.authorName;
  const isbn = req.body.isbn;
  const date = req.body.date;
  const score = req.body.score;
  const bookNotes = req.body.bookNotes;
  const myNotes = req.body.myNotes;

  try {
    await db.query(
      "INSERT INTO book(isbn,author,dateread,score,booknotes,mynotes,name) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [isbn, authorName, date, score, bookNotes, myNotes, bookName]
    );
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.get("/readMore", async (req, res) => {
  console.log("read more");
  const isbn = req.query.isbn;

  try {
    const result = await db.query("SELECT * FROM book WHERE isbn=$1", [isbn]);
    const book = result.rows[0];
    res.render("readMore.ejs", {
      book: book,
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/sortByScore", async (req, res) => {
  const query = "SELECT * FROM book ORDER BY score DESC";
  try {
    const result = await db.query(query);
    book = result.rows;
    // console.log(book);
  } catch (err) {
    console.log(err);
  }
  res.render("index.ejs", {
    books: book,
    decider: "score",
  });
});
app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/sortByDate", async (req, res) => {
  const query = "SELECT * FROM book ORDER BY dateread DESC";
  try {
    const result = await db.query(query);
    book = result.rows;
    // console.log(book);
  } catch (err) {
    console.log(err);
  }
  res.render("index.ejs", {
    books: book,
    decider: "date",
  });
});
app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.listen(port, () => {
  console.log("Server up and running at port 3000");
});
