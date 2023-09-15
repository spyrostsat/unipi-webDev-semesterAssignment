const express = require("express");
const mysql = require("mysql");
const utils = require("../utils");

const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.PASSWORD,
        database: process.env.DATABASE_NAME
    });

db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
            }
    });

function queryDatabase(sql)
{
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
        });
    });
}

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {title: "Home Page"});
});

router.get('/home', (req, res) => {
    res.render('home', {title: "Home Page"});
});

router.get('/about', (req, res) => {
    res.render('about', {title: "About Page"});
});

router.get('/contact', (req, res) => {
    res.render('contact', {title: "Contact Page"});
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
    let searched_user = null;
    searching_email = req.query.searching_email;
    const get_user_command = `SELECT * FROM users WHERE email = "${searching_email}";`;
    queryDatabase(get_user_command)
    .then(result => {
        for (let row of result) searched_user = { ...row }; // there is only one row max, since emails uniquely identify users
        res.render('register', {title: "Register Page", searched_user: searched_user});  
    })
    .catch(err => {
        console.log(err);
        res.render('register', {title: "Register Page"});
    });
});

router.post('/register', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let address = req.body.address;
    let country = req.body.country;
    let zipCode = req.body.zipCode;
    let telephone = req.body.telephone;
    let creditCard = req.body.creditCard;
    let cardType = req.body.cardType;

    // Validation of all form fields
    let valid_username = utils.isGreekString(username);
    let valid_address = utils.isValidAddress(address);
    let validZipCode = utils.isValidZipCode(zipCode);
    let validPhone = utils.isValidPhoneNumber(telephone);
    let validCreditCard = utils.isValidNDigitString(creditCard, 16);

    let valid_entry = true;

    if (!valid_username || !valid_address || !validZipCode || !validPhone || !validCreditCard) valid_entry = false;

    if (!valid_entry)
    {
        console.log("Invalid entry. Please check your form and resubmit.")
        res.redirect('/register');
    }
    else
    {
        // Check that the new row has a new email, which is the field that uniquely intentifies users
        let unique_email = true;

        queryDatabase(`SELECT email from users;`)
        .then(results =>
        {
            for (let row of results) {
                if (row.email === email) {
                    unique_email = false;
                    break;
                }
            }
            if (unique_email)
            {
                const insert_row = `INSERT INTO users (username, email, address, country, zip_code, phone, card_number, card_type)
                VALUES ("${username}", "${email}", "${address}", "${country}", "${zipCode}", "${telephone}", ${creditCard}, "${cardType}");`
                
                return queryDatabase(insert_row);
            }
            else
            {
                return new Promise((resolve, reject) => {
                    reject(`User with email "${email}" already exists.`);
                });
            }
        })
        .then(new_results => console.log(`User with email "${email}" was inserted to the db.`))
        .catch(err => console.log(err));

        res.redirect('/register');
    }
});

router.post('/register/search-by-email', (req, res) => {
    searching_email = req.body.searchEmail;
    res.redirect('/register?searching_email=' + searching_email);
});

router.post('/register/update-user', (req, res) => {
    let new_username = req.body.username;
    let existing_email = req.body.email;
    let new_address = req.body.address;
    let new_country = req.body.country;
    let new_zipCode = req.body.zipCode;
    let new_telephone = req.body.telephone;
    let new_creditCard = req.body.creditCard;
    let new_cardType = req.body.cardType;

    // Validation of all form fields
    let valid_username = utils.isGreekString(new_username);
    let valid_address = utils.isValidAddress(new_address);
    let validZipCode = utils.isValidZipCode(new_zipCode);
    let validPhone = utils.isValidPhoneNumber(new_telephone);
    let validCreditCard = utils.isValidNDigitString(new_creditCard, 16);

    let valid_entry = true;

    if (!valid_username || !valid_address || !validZipCode || !validPhone || !validCreditCard) valid_entry = false;

    if (!valid_entry)
    {
        console.log("Invalid entry. Please check your form and resubmit.")
        res.redirect('/register');
    }
    else
    {
        const update_user_command = `UPDATE users SET username = "${new_username}", address = "${new_address}", country = "${new_country}", zip_code = "${new_zipCode}", phone = "${new_telephone}", card_number = ${new_creditCard}, card_type = "${new_cardType}" WHERE email = "${existing_email}";`;

        queryDatabase(update_user_command)
        .then(result => {
            const user_found = result.affectedRows === 1;
            console.log(`User with email "${existing_email}" was updated.`)
        })
        .catch(err => {
            console.log(err);
        });

        res.redirect('/register');
    }
});

module.exports = router;
