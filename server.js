const express = require("express");
const expressLayouts = require("express-ejs-layouts");

if (process.env.NODE_ENV !== 'production')
{
    require('dotenv').config();
}

const indexRouter = require("./routes/index");

const app = express();

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', __dirname + '/views'); // Set the views directory
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.static('public'));

const mysql = require("mysql");

// Create a MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',     // Replace with your MySQL host
    user: 'root',     // Replace with your MySQL username
    password: process.env.PASSWORD, // Replace with your MySQL password
    database: 'unipiWebAssignment'    // Replace with your MySQL database name
  });
  
  // Connect to the MySQL database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as threadId: ' + db.threadId);
  });



app.use("/", indexRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
