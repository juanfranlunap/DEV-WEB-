const express = require("express");
const path = require("path");
const app = express(); 

app.set("view engine", "ejs");
app.set("views", __dirname + "/html");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let names = [];
let tasks = [];

app.get("/", (req, res) => {
  res.render("index", { names, tasks });
});

app.get("/greet", (req, res) => {
  const name = req.query.name;

  if (name && name.trim() !== "") {
    names.push(name);
    console.log("New name received:", name); 
    res.render("index", { names, tasks });
  } else {
    res.render("index", {
      names,
      tasks,
      error: "Please enter a valid name!",
    });
  }
});


app.get("/wazzup", (req, res, next) => {
  const index = parseInt(req.query.index);

  if (isNaN(index) || index < 0 || index >= names.length) {
    const error = new Error("Invalid index!");
    return next(error); 
  }

  const name = names[index];
  res.render("wazzup", { name });
});

app.post("/task", (req, res) => {
  const newTask = req.body.task;
  if (newTask && newTask.trim() !== "") {
    tasks.push(newTask);
  }
  res.redirect("/");
});

app.get("/task", (req, res) => {
  res.json(tasks);
});

app.get("/task/delete", (req, res) => {
  const index = parseInt(req.query.index);
  if (!isNaN(index) && index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
  }
  res.redirect("/");
});

app.get("/task/up", (req, res) => {
  const i = parseInt(req.query.index);
  if (i > 0 && i < tasks.length) {
    [tasks[i - 1], tasks[i]] = [tasks[i], tasks[i - 1]];
  }
  res.redirect("/");
});

app.get("/task/down", (req, res) => {
  const i = parseInt(req.query.index);
  if (i >= 0 && i < tasks.length - 1) {
    [tasks[i], tasks[i + 1]] = [tasks[i + 1], tasks[i]];
  }
  res.redirect("/");
});

app.put("/greet/:name", (req, res) => {
  const newName = req.params.name;
  names.push(newName);
  res.json(names);
});

app.use((err, req, res, next) => {
  console.error("Error detected:", err.message);
  res.status(400).render("index", {
    names,
    tasks,
    error: err.message,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});