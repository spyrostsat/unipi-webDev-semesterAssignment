const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {title: "Home Page", msg: "Home"});
});

router.get('/home', (req, res) => {
    res.render('home', {title: "Home Page", msg: "Home"});
});

router.get('/about', (req, res) => {
    res.render('about', {title: "About Page", msg: "About"});
});

router.get('/contact', (req, res) => {
    res.render('contact', {title: "Contact Page", msg: "Contact"});
});

router.get('/cristie', (req, res) => {
    res.render('cristie', {title: "Agatha Cristie"});
});

router.get('/dickens', (req, res) => {
    res.render('dickens', {title: "Charles Dickens"});
});

router.get('/king', (req, res) => {
    res.render('king', {title: "Stephen King"});
});

router.get('/rowling', (req, res) => {
    res.render('rowling', {title: "J.K. Rowling"});
});

router.get('/steel', (req, res) => {
    res.render('steel', {title: "Danielle Steel"});
});

router.get('/register', (req, res) => {
    res.render('register', {title: "Home Page", msg: "Register"});
});

router.post('/register', (req, res) => {
    res.redirect('register', {title: "Home Page", msg: "Register"});
});

module.exports = router;
