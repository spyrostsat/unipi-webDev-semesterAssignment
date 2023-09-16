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
    let msg = req.query.msg;
    let msg_category = req.query.msg_category;
    let serialized_current_user = req.query.current_user;
    let current_user = null;
    if (serialized_current_user !== undefined) current_user = JSON.parse(decodeURIComponent(serialized_current_user));
    res.render('register', {title: "Register Page", current_user, msg, msg_category});
});

router.post('/register', async (req, res) => {
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
        let msg = "";

        let current_user = { // we collect the submitted-form data in the current_user Object to feed it back to the /register get route and from there back to the front-end
            username: username,
            email: email,
            address: address,
            country: country,
            zip_code: zipCode,
            phone: telephone,
            card_number: creditCard,
            card_type: cardType
        }

        if (!valid_username) msg += "Username: Only greek characters are allowed.";
        if (!valid_address) msg += "Address: Only greek characters are allowed.";
        if (!validZipCode) msg += "Zip code: Only numbers with up to 5 digits are allowed.";
        if (!validPhone) msg += "Telephone: Only the form '+30210xxxxxxx' is allowed.";
        if (!validCreditCard) msg += "Credit Card: Only numbers with 16 digits are allowed.";

        msg += "Please check your form and resubmit. Register was not completed.";
        
        let serialized_current_user = JSON.stringify(current_user);
        
        res.redirect(`/register?current_user=${encodeURIComponent(serialized_current_user)}&msg=${msg}&msg_category=danger`);
    }
    else
    {
        try
        {
            // Check that the new row has a new email, which is the field that uniquely intentifies users
            let unique_email = true;

            results = await queryDatabase(`SELECT email from users;`);
            let msg;
            let msg_category;
            for (let row of results)
            {
                if (row.email === email) {
                    unique_email = false;
                    break;
                }
            }
            if (unique_email)
            {
                const insert_row = `INSERT INTO users (username, email, address, country, zip_code, phone, card_number, card_type)
                VALUES ("${username}", "${email}", "${address}", "${country}", ${zipCode}, "${telephone}", ${creditCard}, "${cardType}");`
                
                results = await queryDatabase(insert_row);
                console.log(`User with email "${email}" was inserted to the db.`);
                msg = `User with email "${email}" was inserted to the db.`;
                msg_category = 'success';
            }
            else
            {
                console.log(`User with email "${email}" already exists.`);
                msg = `User with email "${email}" already exists.`;
                msg_category = 'danger';
            }
            res.redirect(`/register?msg=${msg}&msg_category=${msg_category}`);
        }
        catch (err)
        {
            console.log(err);
            res.redirect('/register');
        }
    }
});

router.post('/register/search-by-email', async (req, res) => {
    searching_email = req.body.searchEmail;
    let current_user = null;
    const get_user_command = `SELECT * FROM users WHERE email = "${searching_email}";`;
    let msg;
    let msg_category;
    try {
        result = await queryDatabase(get_user_command);
        for (let row of result) current_user = { ...row }; // there is only one row max, since emails uniquely identify users
        if (current_user)
        {
            msg = `User with email "${searching_email}" was found in the db.`;
            msg_category = 'success';
        }
        else
        {
            msg = `User with email "${searching_email}" was not found in the db.`;
            msg_category = 'danger';
        }

        serialized_current_user = JSON.stringify(current_user);
        res.redirect(`/register?current_user=${encodeURIComponent(serialized_current_user)}&msg=${msg}&msg_category=${msg_category}`);
    }
    catch (err) {
        console.log(err);
        res.redirect('/register');
    }

});

router.post('/register/update-user', async (req, res) => {
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
        let msg = "";

        let current_user = { // we collect the submitted-form data in the current_user Object to feed it back to the /register get route and from there back to the front-end
            username: new_username,
            email: existing_email,
            address: new_address,
            country: new_country,
            zip_code: new_zipCode,
            phone: new_telephone,
            card_number: new_creditCard,
            card_type: new_cardType
        }

        if (!valid_username) msg += "Username: Only greek characters are allowed.";
        if (!valid_address) msg += "Address: Only greek characters are allowed.";
        if (!validZipCode) msg += "Zip code: Only numbers with up to 5 digits are allowed.";
        if (!validPhone) msg += "Telephone: Only the form '+30210xxxxxxx' is allowed.";
        if (!validCreditCard) msg += "Credit Card: Only numbers with 16 digits are allowed.";

        msg += "Please check your form and resubmit. Update was not completed.";

        let serialized_current_user = JSON.stringify(current_user);
        res.redirect(`/register?current_user=${encodeURIComponent(serialized_current_user)}&msg=${msg}&msg_category=danger`);
    }
    else // if the submitted form is valid, the request updates the database
    {
        const update_user_command = `UPDATE users SET username = "${new_username}", address = "${new_address}", country = "${new_country}", zip_code = ${new_zipCode}, phone = "${new_telephone}", card_number = ${new_creditCard}, card_type = "${new_cardType}" WHERE email = "${existing_email}";`;
        try {
            result = await queryDatabase(update_user_command);
            const user_found = result.affectedRows === 1;
            let msg;
            let msg_category;
            if (user_found)
            {
                msg = `User with email "${existing_email}" was updated.`
                msg_category = 'success';
            }
            else
            {
                msg = `No user with email "${existing_email}" exists in the database.`
                msg_category = 'danger';
            }
            res.redirect(`/register?msg=${msg}&msg_category=${msg_category}`);
        }
        catch (err) {
            console.log(err);
            res.redirect('/register');
        }
    }
});

module.exports = router;
