const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const fs = require('fs')
const path = require('path')

const userFilePath = path.join(__dirname, 'users.json')
const bookFilePath = path.join(__dirname, 'books.json')

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const getUsers = () => {
  try {
    const users = JSON.parse(fs.readFileSync(userFilePath))
    return users
  } catch (error) {
    return users = []
  }
}

const getBooks = () => {
  try {
    const books = JSON.parse(fs.readFileSync(bookFilePath))
    return books
  } catch (error) {
    return books = {}
  }
}

const usernameExist = (username) => {
  const users = getUsers()
  let userwithsamename = users.filter(user => {
    return user.username === username
  })
  if (userwithsamename.length > 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  try {
    const users = JSON.parse(fs.readFileSync(userFilePath))
    let validUsers = users.filter(user => {
        return (user.username === username && user.password === password)
      })
      if (validUsers.length > 0) {
        return true
      } else {
        return false
      }
  } catch (error) {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body
  if (!username || !password) {
    return res.status(404).json({
      message: "username and password required"
    })
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60})
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "Login successful"})
  } else {
    res.status(208).json({message: "Invalid Login. Check your username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {review} = req.query
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  if (!review) {
    return res.status(400).json({message: 'No review passed!'})
  }
 try {
   const books = getBooks()
   if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"})
   }
   const reviews = {
    username, review
   }
   books[isbn].reviews.push(reviews)
   fs.writeFileSync(bookFilePath, JSON.stringify(books))
   res.status(200).json({
    message: "Review added successfully",
    book: books[isbn]
   })
 } catch (error) {
  res.status(500).json({Error: error.message})
 }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const username = req.session.authorization.username
 try {
   const books = getBooks()
   if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"})
   }
   
   const index = books[isbn].reviews.findIndex(review => review.username === username)
   if (index === -1) {
    return res.status(404).json({message: "You don't have any review on this book"})
   }
   books[isbn].reviews.splice(index, 1)
   fs.writeFileSync(bookFilePath, JSON.stringify(books))
   res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbn]
   })
 } catch (error) {
  res.status(500).json({Error: error.message})
 }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.usernameExist = usernameExist
