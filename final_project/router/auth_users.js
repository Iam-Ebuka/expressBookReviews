const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

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
    return res.status(400).json({message: "register as a user then try logging in"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
