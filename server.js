require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); //allows us to access apis
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASS,
  database: process.env.DB,
});


app.post("/signup", (req, res) => {
  const sql1 = "SELECT * FROM login WHERE email = ?";
  const sql = "INSERT INTO login (name,email,password) VALUES (?)";

  db.query(sql1, req.body.email, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Success");
    } else {
      const values = [req.body.name, req.body.email, req.body.password];
      db.query(sql, [values], (err, data) => {
        if (err) {
          return res.json("Error");
        }
        return res.json(data);
      });
    }
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json({ status: "Success", data });
    } else {
      return res.json("Failed");
    }
  });
});

app.listen(PORT, () => {
  console.log("Listening...");
});
