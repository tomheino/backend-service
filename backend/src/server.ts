import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app: express.Express = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.PROXYURL
}))

const dbfile: string = path.resolve(process.env.DBFILE || './data/students.db');
const db = new sqlite3.Database(dbfile);

// Create the students table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    credits INTEGER
)`);

// Welcome message
app.get('/', (req:express.Request, res:express.Response) => {
    const resStr = "Hello from backend server"
    console.log(resStr)
    res.send(resStr)
})

// Get all students
app.get('/api/students', (req: express.Request, res: express.Response) => {
    db.all('SELECT * FROM students', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "db error" });
        }
        res.json(rows)
    })
})

// Get student by ID
app.get('/api/student/:id', (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id)
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "db error" })
        }
        if (!row) {
            return res.status(404).json({ error: "Student not found" })
        }
        res.json(row)
    })
})

// Post new student
app.post('/api/student/add', (req: express.Request, res: express.Response) => {
    const student = req.body;

    // Validate that ID, name and credits are defined
    if (!student || !student.id || !student.name || !student.credits) {
        return res.status(400).json({ error: "Missing information!" });
    }

    // Check if the ID already exists
    const id: number = Number(student.id);
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, existingStudent) => {
        if (err) {
            return res.status(500).json({ error: "db error" });
        }

        if (existingStudent) {
            return res.status(400).json({ error: "Student with the specified ID already exists" });
        }
    

        // Insert the new student if validation passes
        db.run('INSERT INTO students (id, name, credits) VALUES (?, ?, ?)', [id, student.name, student.credits], function (err) {
            if (err) {
                return res.status(500).json({ error: "db error" });
            }
            console.log(`added: ${JSON.stringify(student)}`)
            res.json({ id, ...student });
        });
    });
});


// Update student
app.put('/api/student/update', (req: express.Request, res: express.Response) => {
    const updatedStudent = req.body;
    if (!updatedStudent.id) {
        return res.status(400).json({ error: "Missing student ID" });
    }

    const id: number = Number(updatedStudent.id);
    db.run('UPDATE students SET name = ?, credits = ? WHERE id = ?', [updatedStudent.name, updatedStudent.credits, id], function (err) {
        if (err) {
            return res.status(500).json({ error: "db error" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        console.log(`updated: ${JSON.stringify(updatedStudent)}`)
        res.json({ id, ...updatedStudent });
    });
});

// Remove student by ID
app.delete('/api/student/remove/:id', (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);

    // Check if the student with the specified ID exists
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, existingStudent) => {
        if (err) {
            return res.status(500).json({ error: "db error" });
        }

        if (!existingStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Delete the student if it exists
        db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
            if (err) {
                return res.status(500).json({ error: "db error" });
            }
            console.log(`removed: ${JSON.stringify(existingStudent)}`)
            res.json({ message: "Student removed successfully" });
        });
    });
});


const PORT = process.env.BACKPORT || 5001;
app.listen(PORT, () => {
    console.log(`Backend server listening: ${PORT}`);
});


