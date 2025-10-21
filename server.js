const express = require("express");
// express-session helps manage sessions (to remember logged-in users)
const session = require("express-session");
const path = require("path");

// Create an Express app
const app = express();
const PORT = 3000;

// __dirname works automatically in CommonJS, no need for fileURLToPath

// Middleware setup

// body parser - allows server to read form data
app.use(express.urlencoded({ extended: true }));

// serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// no-cache middleware to prevent showing old pages after logout
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// session setup
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// fake user for testing
const USER = { username: "admin", password: "irfadc" };

// Serve login page
app.get("/", (req, res) => res.redirect("/html/index.html"));

// Handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    console.log(req.body);
    // store username in session
    req.session.user = username;
    return res.redirect("/dashboard");
  } else {
    return res.send("<h1>Invalid credentials ❌</h1><a href='/'>Try Again</a>");
  }
});

// Protected route
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "html", "dashboard.html"));
});

// Handle logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
