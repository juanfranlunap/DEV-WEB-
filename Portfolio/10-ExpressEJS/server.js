const express = require("express");
const app = express();
const https = require("https");
const path = require("path");

app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "ejs"));  


const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";


let posts = [];
let name;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});


app.get("/login", (req, res) => {
  name = req.query.name;
  res.render("wzzup", { name, method: "GET" });
});


app.post("/login", (req, res) => {
  name = req.body.name;
  res.render("wzzup", { name, method: "POST" });
});


app.get("/home", (req, res) => {
  if (!name) return res.redirect("/"); 
  res.render("home", { name, posts });
});


app.post("/add-post", (req, res) => {
  const { title, content } = req.body;
  posts.push({ id: Date.now(), title, content });
  res.redirect("/home");
});


app.get("/post/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.redirect("/home");
  res.render("post", { post });
});

app.post("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) post.content = req.body.content;
  res.redirect("/home");
});

+
app.post("/delete/:id", (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect("/home");
});


app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
