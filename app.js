const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(async (req, res, next) => {
  console.log(new Date().toUTCString());
  console.log(req.method);
  console.log(req.originalUrl);
  if (req.session.AuthCookie) {
    console.log("Authenticated");
  } else {
    console.log("Not Authenticated");
  }
  next();
});

app.use("/private", (req, res, next) => {
  if (!req.session.AuthCookie) {
    res.status(403).render("views/error");
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
