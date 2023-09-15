if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// const mysql = require("mysql");
// const sql_commands = require("./models/sql_commands");
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE_NAME
//   });
  
//   db.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL: ' + err.stack);
//       return;
//     }
//     console.log('Connected to MySQL as threadId: ' + db.threadId + "\n========================================");
//     db.query(sql_commands.create_table, (err, result) => {
//       if (err) {
//         console.error('Error executing the create_table query: ' + err.stack);
//         return;
//       }
//       console.log("Table created, Result: ", result);
//     })
//   });

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
}); 
