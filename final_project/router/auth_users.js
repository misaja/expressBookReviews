const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return !(users.find((user) => user.username === username));
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  let match = books[req.params.isbn];
  if (match) {
    let username = req.session.authorization.username;
    match.reviews[username] = { review: review };
    return res.status(200).send("The review for the book with ISBN " + req.params.isbn + " has been added/updated");
  } else {
    return res.status(404).send();
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let match = books[req.params.isbn];
  if (match) {
    let username = req.session.authorization.username;
    delete match.reviews[username];
    return res.status(200).send("The review for the book with ISBN " + req.params.isbn + " posted by user " + username + " has been deleted");
  } else {
    return res.status(404).send();
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
