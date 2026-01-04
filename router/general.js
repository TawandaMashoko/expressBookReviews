const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// =============================
// REGISTER A NEW USER
// =============================
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add new user to the users array
  users.push({ username: username, password: password });
  return res.status(201).json({ message: "User registered successfully. You can now login." });
});


// ASYNC HELPERS
// Simulate async data fetching (like a production database or API)
function getBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books) resolve(books);
      else reject("Books data not available");
    }, 1000);
  });
}

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    }, 1000);
  });
}

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = [];
      const keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push(books[key]);
        }
      });

      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject("Author not found");
    }, 1000);
  });
}

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = [];
      const keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          matchingBooks.push(books[key]);
        }
      });

      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject("No books found with this title");
    }, 1000);
  });
}


// TASK 10: Get list of all books (ASYNC)

public_users.get('/', async (req, res) => {
  try {
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error });
  }
});


// TASK 11: Get book details based on ISBN (ASYNC)

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


// TASK 12: Get book details based on author (ASYNC)

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


// TASK 13: Get book details based on title (ASYNC)

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


// TASK 5 (from before): Get book review

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
