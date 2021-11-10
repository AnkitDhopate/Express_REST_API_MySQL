const express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");

app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "android_studio_user",
  multipleStatements: true,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  }

  if (!error) {
    console.log("Connected successfully");
  }
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/user/create", async (req, res) => {
  const { name, email, password } = req.body;
  const hash_password = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO user(name, email, password) VALUES (?, ?, ?)",
    [name, email, hash_password],
    (error, result) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (result) {
        return res.status(201).json({ user: result });
      }
    }
  );
});

app.get("/user/get_all_users", (req, res) => {
  db.query("SELECT name, email FROM user", (error, result) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (result) {
      return res.status(201).json({ users: result });
    }
  });
});

app.listen(2000, () => {
  console.log("Connect on port 2000");
});
