const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check if username and password are provided
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }

  //check if user exists
  if(isValid(username)){
    return res.status(409).json({message: "Username already exists"});
  }
  //add new user to the users array
  users.push({username: username, password: password});
  return res.status(201).json({message: "User registered successfully, You can now login"});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //This is the route that returns all the books in the shops ie. the books objects from booksdb.js
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  // check if the isbn exists in the books database
  if(books[isbn]){
    return res.status(200).send(books[isbn]);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];

  //Getting all book ID's
  let keys = Object.keys(books);

  //loop for each book and finding which one matches
  keys.forEach((key) =>{
    if(books[key].author.toLowerCase() === author.toLowerCase()){
      matchingBooks.push(books[key]);
    }
  });

  if(matchingBooks.length > 0){
    return res.status(200).send(JSON.stringify(matchingBooks, null,4));
  }else{
    return res.status(404).json({message: "Author not found"});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let matchingBooks = [];

  //Getting all book ID's(keys)
  let keys = Object.keys(books);

  //loop for each book and finding which one matches
  keys.forEach((key) =>{
    if(books[key].title.toLowerCase() === title.toLowerCase()){
      matchingBooks.push(books[key]);
    }
  });

  if(matchingBooks.length > 0){
    return res.status(200).send(JSON.stringify(matchingBooks, null,4));
  }else{
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  //check if the isbn exists in the books database
  if(books[isbn]){
    //returning only the reviews of that book
    return res.status(200).send(books[isbn].reviews);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
