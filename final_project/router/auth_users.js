const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "john", "password": "password"}];

const isValid = (username)=>{ 
    let usersWithSameName = users.filter((user)=> user.username === username);
    if(usersWithSameName.length == 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let validUser = users.filter((user)=> user.username == username && user.password == password)
    if(validUser.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(403).json({message:"Check that you fill username or password"})
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, "access", {
        expiresIn: 60 * 60
    })
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("user has successfully logged in")
  } else {
    return res.status(403).json({message: "register as a user then try logging in"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username; // Retrieve username from session
    const isbn = parseInt(req.params.isbn); // Assuming ISBN is sent in the request params
    const review = req.query.review; // Review text sent in the request query
  
    if (!username || !isbn || !review) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already reviewed this book
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // If the user has already reviewed, modify the existing review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // If this is a new review by the user, add it to the book's reviews
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    }  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username; // Retrieve username from session
    const isbn = parseInt(req.params.isbn); // Retrieve ISBN from route parameter
  
    if (!username || !isbn) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has a review for this book
    if (!books[isbn].reviews.hasOwnProperty(username)) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    // Delete the review for the specified user and ISBN
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
