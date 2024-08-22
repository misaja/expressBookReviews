const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // with async/await
  let f = async function () {
    const action = new Promise((resolve, reject) => {
      resolve (res.status(200).send(JSON.stringify(books, null, ' ')));
    });
    await action;
    console.log("Promise fullfilled!");
  };
  f();
  /* regular style
  let txt = JSON.stringify(books, null, ' ');
  return res.status(200).send(txt);
  */
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // with Promise
  const action = new Promise((resolve, reject) => {
    let match = books[req.params.isbn];
    if (match) {
      resolve (res.status(200).send(JSON.stringify(match, null, ' ')));
    } else {
      reject (res.status(404).send());
    }
  });
  action.then(() => {console.log("Promise fullfilled!")}).catch(console.error());
  /* regular style
  let match = books[req.params.isbn];
  if (match) {
    return res.status(200).send(JSON.stringify(match, null, ' '));
  } else {
    return res.status(404).send();
  }
  */
});

//  Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  let match = books[req.params.isbn];
  if (match) {
    return res.status(200).send(JSON.stringify(match.reviews, null, ' '));
  } else {
    return res.status(404).send();
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // with Promise
  const action = new Promise((resolve, reject) => {
    let booksArray = Object.values(books);
    let matches = booksArray.filter((item) => item.author.indexOf(req.params.author) > -1);
    if (matches.length > 0) {
      resolve (res.status(200).send(JSON.stringify(matches, null, ' ')));
    } else {
      reject (res.status(404).send());
    }
  });
  action.then(() => {console.log("Promise fullfilled!")}).catch(console.error());
  /* regular style
  let booksArray = Object.values(books);
  let matches = booksArray.filter((item) => item.author.indexOf(req.params.author) > -1);
  if (matches.length > 0) {
    return res.status(200).send(JSON.stringify(matches, null, ' '));
  } else {
    return res.status(404).send();
  }
  */
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // with Promise
  const action = new Promise((resolve, reject) => {
    let booksArray = Object.values(books);
    let matches = booksArray.filter((item) => item.title.indexOf(req.params.title) > -1);
    if (matches.length > 0) {
      resolve (res.status(200).send(JSON.stringify(matches, null, ' ')));
    } else {
      reject (res.status(404).send());
    }
  });
  action.then(() => {console.log("Promise fullfilled!")}).catch(console.error());
  /* regular style
  let booksArray = Object.values(books);
  let matches = booksArray.filter((item) => item.title.indexOf(req.params.title) > -1);
  if (matches.length > 0) {
    return res.status(200).send(JSON.stringify(matches, null, ' '));
  } else {
    return res.status(404).send();
  }
  */
});

module.exports.general = public_users;
