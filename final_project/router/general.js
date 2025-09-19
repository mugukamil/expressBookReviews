const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res
                .status(200)
                .json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    const booksData = await new Promise((resolve) => resolve(books));
    return res.send(JSON.stringify(booksData, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const book = await new Promise((resolve) => resolve(books[req.params.isbn]));

    return res.send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    const book = await new Promise((resolve) =>
        resolve(Object.values(books).filter((book) => book.author === req.params.author)),
    );

    return res.send(JSON.stringify(book, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const book = await new Promise((resolve) =>
        resolve(Object.values(books).filter((book) => book.title === req.params.title)),
    );

    return res.send(JSON.stringify(book, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    return res.send(
        JSON.stringify(
            Object.values(books).filter((book) => book.isbn === req.params.isbn),
            null,
            4,
        ),
    );
});

module.exports.general = public_users;
