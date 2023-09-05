const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {title: "Home Page", msg: "My message"});
});

module.exports = router;