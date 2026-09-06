const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "studentdb"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("Database connected successfully");
    }
});
app.use(express.static("public"));

app.get("/studentinfo", (req, res) => {
    res.send("Student Information System");
});
app.post("/students", (req, res) => {
    const { name, age } = req.body;

    const sql = "INSERT INTO students (name, age) VALUES (?, ?)";

    db.query(sql, [name, age], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error inserting student");
        } else {
            res.send("Student inserted successfully");
        }
    });
});
app.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error retrieving students");
        } else {
            res.json(results);
        }
    });
});
app.put("/students/:id", (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;

    const sql = "UPDATE students SET name = ?, age = ? WHERE id = ?";

    db.query(sql, [name, age, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error updating student");
        } else {
            res.send("Student updated successfully");
        }
    });
});
app.delete("/students/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error deleting student");
        } else {
            res.send("Student deleted successfully");
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on port " + PORT);
});
