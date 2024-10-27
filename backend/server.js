const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
const { Parser } = require('json2csv');
const moment = require('moment');
const app = express();
const port = 8081;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// MySQL database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', //you have to write your system user
    password: 'password', // your user's password
    database: 'bookinventory'
});

// Connecting to the MySQL database and handling connection errors
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

// API to get all records from the 'inventory' table
app.get("/", (req, res) => {
    const sql = "SELECT * FROM inventory";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

// API to get a single book by ID
app.get("/books/:id", (req, res) => {
    const sql = "SELECT * FROM inventory WHERE EntryID = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) {
            console.error("SQL Error: ", err);
            return res.status(500).json("Error fetching book");
        }
        return data.length > 0 ? res.json(data[0]) : res.status(404).json("Book not found");
    });
});

// API to create a new book record in the 'inventory' table
app.post('/create', (req, res) => {
    const sql = "INSERT INTO inventory (`Title`, `Author`, `Genre`, `PublicationDate`, `ISBN`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.author,
        req.body.genre,
        req.body.publicationdate,
        req.body.isbn
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

// API to update an existing book record in the 'inventory' table
app.put('/update/:id', (req, res) => {
    const sql = "UPDATE inventory SET `Title`=?, `Author`=?, `Genre`=?, `PublicationDate`=?, `ISBN`=? WHERE EntryID=?";
    const values = [
        req.body.title,
        req.body.author,
        req.body.genre,
        req.body.publicationdate,
        req.body.isbn
    ];

    db.query(sql, [...values, req.params.id], (err, data) => {
        if (err) {
            console.error("SQL Error: ", err);
            return res.status(500).json({
                message: "Database update failed",
                error: err.sqlMessage || err
            });
        }
        return res.json({
            message: "Record updated successfully",
            affectedRows: data.affectedRows
        });
    });
});

// API to delete a book by ID
app.delete('/books/:id', (req, res) => {
    const sql = 'DELETE FROM inventory WHERE EntryID = ?';

    db.query(sql, [req.params.id], (err, data) => {
        if (err) {
            console.error('Error deleting record:', err);
            return res.status(500).json({ error: 'Error deleting the record.' });
        }

        return data.affectedRows === 0
            ? res.status(404).json({ message: 'Book not found.' })
            : res.status(200).json({ message: 'Book deleted successfully.' });
    });
});

// API to search for books by title, author, or genre
app.get("/search", (req, res) => {
    const searchTerm = `%${req.query.q}%`;
    const sql = "SELECT * FROM inventory WHERE Title LIKE ? OR Author LIKE ? OR Genre LIKE ?";

    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, data) => {
        if (err) {
            console.error("SQL Error: ", err);
            return res.status(500).json("Error fetching books");
        }
        return res.json(data);
    });
});


// Export inventory as JSON
app.get('/export/json', (req, res) => {
    const sql = "SELECT * FROM inventory";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching books" });

        // Format the PublicationDate
        const formattedData = data.map(book => ({
            EntryID: book.EntryID,
            Title: book.Title,
            Author: book.Author,
            Genre: book.Genre,
            PublicationDate: moment(book.PublicationDate).format('MMMM D, YYYY'), // Format as "Month Day, Year"
            ISBN: book.ISBN
        }));

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=book_inventory.json');
        return res.json(formattedData);
    });
});

// Export inventory as CSV
app.get('/export/csv', (req, res) => {
    const sql = "SELECT * FROM inventory";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching books" });

        // Format the PublicationDate and adjust ISBN
        const formattedData = data.map(book => ({
            EntryID: book.EntryID,
            Title: book.Title,
            Author: book.Author,
            Genre: book.Genre,
            PublicationDate: moment(book.PublicationDate).format('MMMM D, YYYY'), // Format as "Month Day, Year"
            ISBN: book.ISBN.padEnd(20, ' ') // Simulate a wider column
        }));

        const fields = ['EntryID', 'Title', 'Author', 'Genre', 'PublicationDate', 'ISBN'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(formattedData);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=book_inventory.csv');
        res.status(200).end(csv);
    });
});


// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
