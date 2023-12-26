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

  //Note: Assuming the name is "chinua-achebe" or "chinua%20achebe" in the params
  //"Chinua Achebe" will also work
  let writer = author.replace(/-|%20/g, ' ')
    .split(' ')
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

    let bookTitle = title.replace(/-|%20/g, ' ')
    .split(' ')
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


//task 10
public_users.get('/task10', function (req, res) {
  const sendBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000); 
  });

  // Handling the promise resolution
  sendBooksPromise.then((books) => {
    res.status(200).send(JSON.stringify(books, null, 4));
  }).catch((error) => {
    console.error('Error occurred:', error);
    res.status(500).send('An error occurred');
  });
})


  //task 11
  // Function to fetch book data asynchronously using a Promise
  function fetchBookData(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        const filteredBook = books[isbn];
        if (filteredBook) {
            resolve(filteredBook);
        } else {
            reject(new Error('Book does not exist in library'));
        }
        }, 1000); 
  });
}
  public_users.get('/isbn/:isbn/task11', function (req, res) {
    const isbn = req.params.isbn;

    // Fetching book data asynchronously using the function with a Promise
    fetchBookData(isbn)
        .then((filteredBook) => {
        res.status(200).send(filteredBook);
        })
        .catch((error) => {
        res.status(400).json({ message: error.message });
        });
});


//task 12
function findBookByAuthor(authorName) {
  return new Promise((resolve, reject) => {
    //assuming author is "chinua-achebe" or "chinua%20achebe" in params

  let writer = authorName.replace(/-|%20/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    const findBook = Object.keys(books)
      .filter(key => books[key].author === writer)
      .map(key => books[key]);

    if (findBook.length > 0) {
      resolve(findBook[0]);
    } else {
      reject(new Error('No book with such author'));
    }
  });
}

  public_users.get('/author/:author/task12', function (req, res) {
  const author = req.params.author;

  findBookByAuthor(author)
    .then(book => {
      res.status(200).send(book);
    })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
});


//task 13
function findBookByTitle(title) {
    return new Promise((resolve, reject) => {
        //assuming the title is "things-fall-apart" or "things%20fall%20apart" in params
      const bookTitle = title
        .replace(/-|%20/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const findBook = Object.keys(books)
        .filter(key => books[key].title === bookTitle)
        .map(key => books[key]);
  
      if (findBook.length > 0) {
        resolve(findBook[0]);
      } else {
        reject(new Error('No book with such title'));
      }
    });
  }
  
  public_users.get('/title/:title/task13', function (req, res) {
    const title = req.params.title;
  
    findBookByTitle(title)
      .then(book => {
        res.status(200).send(book);
      })
      .catch(error => {
        res.status(400).json({ message: error.message });
      });
  });

  
  



module.exports.general = public_users;
