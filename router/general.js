const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 10: Get the book list available in the shop using async/await + Axios
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching book list",
      error: error.message,
    });
  }
});

// Task 11: Get book details based on ISBN using async/await + Axios
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({
      message: "Book not found",
      error: error.message,
    });
  }
});

// Task 12: Get book details based on author using async/await + Axios
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({
      message: "Author not found",
      error: error.message,
    });
  }
});

// Task 13: Get book details based on title using async/await + Axios
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({
      message: "Title not found",
      error: error.message,
    });
  }
});

module.exports.general = public_users;
