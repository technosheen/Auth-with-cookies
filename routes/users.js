const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const users = require("../users");

router.get("/", async (req, res) => {
  if (req.session.AuthCookie) {
    res.redirect("/private");
  } else {
    res.render("views/login");
  }
});

router.post("/login", async (req, res) => {
  /*get req.body username and password
	const { username, password } = req.body;
	here, you would get the user from the db based on the username, then you would read the hashed pw
	and then compare it to the pw in the req.body
	let match = bcrypt.compare(password, 'HASHED_PW_FROM DB');
	if they match then set req.session.user and then redirect them to the login page
	 I will just do that here */
  const { username, password } = req.body;
  let loggedIn;
  users.forEach((element) => {
    if (element.username === username) {
      if (bcrypt.compareSync(password, element.hashedPassword)) {
        loggedIn = true;
        req.session.AuthCookie = {
          username: element.username,
          firstName: element.firstName,
          lastName: element.lastName,
          id: element._id,
        };
        res.redirect("/private");
      }
    }
  });
  if (!loggedIn) {
    res.status(401).render("views/login", { error: true });
  }
});

router.get("/private", async (req, res) => {
  res.render("views/private", req.session.AuthCookie);
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.render("views/logout");
});

module.exports = router;
