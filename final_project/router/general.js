const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

   if(!username || !password) {
    return res.status(404).json({message:"Check that you have put a username or password"})
  } else {
    if(isValid(username)) {
        users.push({"username":username, "password":password});
        return res.status(200).send(`username ${username} account has been created, you can now log in`)
    } else {
        res.status(403).json({message:"username already exist"})
    }
  }


  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let filtered_book = books[isbn]
  if(filtered_book) {
    return res.status(200).send(filtered_book)
  } else {
  return res.status(400).json({message: "Book does not exist in library"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  //Note: Assuming the name is "chinua-achebe" in the params
  //"Chinua Achebe" will also work
  let writer = author.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let findBook = Object.keys(books)
    .filter(key => books[key].author === writer)
    .map(key => books[key]);

    if(findBook.length > 0) {
        let book = findBook[0]
        res.status(200).send(book)
    } else {
        return res.status(400).json({message: "No book with such author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title

    let bookTitle = title.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let findBook = Object.keys(books)
    .filter(key => books[key].title.toLowerCase() == bookTitle.toLowerCase())
    .map(key => books[key]);

    if(findBook.length > 0) {
        let book = findBook[0]
        res.status(200).send(book)
    } else {
        return res.status(400).json({message: "No book with such title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let review = books[isbn].reviews
  return res.status(200).send(review)
});

module.exports.general = public_users;
