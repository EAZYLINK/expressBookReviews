const express = require('express');
let isValid = require("./auth_users.js").isValid;
let usernameExist = require('./auth_users.js').usernameExist
const public_users = express.Router();
const fs = require('fs');
const path = require('path')

const userFilePath = path.join(__dirname, 'users.json')
const bookFilePath = path.join(__dirname, 'books.json')

const getBooks = () => {
  try {
    const books = JSON.parse(fs.readFileSync(bookFilePath))
    return books
  } catch (error) {
    return books = {}
  }
}

public_users.post("/register", (req,res) => {
  const {username, password} = req.body
  try {
    if (username && password) {
      if (!usernameExist(username)) {
        const users = JSON.parse(fs.readFileSync(userFilePath))
        newUser = {username, password}
        users.push(newUser)
        fs.writeFileSync(userFilePath, JSON.stringify(users))
        return res.status(200).json({
          message: "User registered successfully. You can proceed to login"
        })
      } else {
        return res.status(400).json({
          message: "User already exists!"
        })
      }
    } 
    return res.status(400).json({
      message: "Username and password required"
    })
  } catch (error) {
    res.status(500).json({Error: error.message})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const books = getBooks()
  return res.status(200).json({
    message: "Books retrieved successfully",
    books
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params
  let filterBooks = {}
  for (let key in books) {
    if (books.hasOwnProperty(key) && key === isbn) {
      filterBooks[key] = books[key]
    }
  }
  if (Object.keys(filterBooks).length === 0) {
    return res.status(404).json({
      message: "Book not found"
    })
  }
  return res.status(200).json({
    message: "Book found",
    book: filterBooks
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const {author} = req.params
  const books = getBooks()
  let filterBooks = {}
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].author === author) {
      filterBooks[key] = books[key]
    }
  }
  if (Object.keys(filterBooks).length === 0) {
    return res.status(404).json({
      message: "Book not found"
    })
  }
  return res.status(200).json({
    message: "Book found",
    book: filterBooks
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const {title} = req.params
  let filterBooks = {}
  const books = getBooks()
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].title === title) {
      filterBooks[key] = books[key]
    }
  }
  if (Object.keys(filterBooks).length === 0) {
    return res.status(404).json({
      message: "Book not found"
    })
  }
  return res.status(200).json({
    message: "Book found",
    book: filterBooks
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
try {
    const {isbn} = req.params
    const books = getBooks()
    const reviews = books[isbn].reviews
    if (reviews.length === 0) {
      return res.status(404).json({
        message: "No review for this book",
        reviews
      })
    }
    return res.status(200).json({
      message: "Review found",
      reviews
    })
} catch (error) {
  res.status(500).json({Error: error.message})
}
});

module.exports.general = public_users;
