import express from "express";
//express-section helps manage sessions (to remember logged-in users).
import session from "express-session";
//path and fileURLToPath → help with file paths, since you’re using ES modules (not CommonJS).
import path from "path";
import { fileURLToPath } from "url";

//You’re creating an Express app named app.
const app = express();
const PORT = 3000;

/*Normally, Node.js gives you __dirname automatically,
but in ES modules (import style), it doesn’t exist by default.
So this code manually sets it, so you can use __dirname later to serve files. */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware setup

/* body parser - This allows your server to read form data that comes from HTML forms
(e.g., <input name="username">).*/
app.use(express.urlencoded({ extended: true }));
/* static files - This tells Express to serve static files (like HTML, CSS, JS, images)
from your public folder. */
app.use(express.static(path.join(__dirname, "public")));

// Add "no-cache" middleware to prevent showing old pages after logout
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/*session set up
A session works like a small memory space on the server to remember who you are after you log in.
This lets your app remember users between page visits.
It creates a small session file or memory object on the server.*/
app.use(
  session({
    //secret used to sign(protect)the session ID
    secret: "mysecretkey",
    //resave: false: avoids saving session to storage if not modified.
    resave: false,
    //saveUninitialized: true: saves a session even if it’s empty at first.
    saveUninitialized: true,
  })
);

/*Just a fake user for testing.
In a real-world app, you’d get this from a database. */
const USER = { username: "admin", password: "irfadc" };

// Serve login page
app.get("/", (req, res) => res.redirect("/html/index.html"));

// Handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    console.log(req.body);
    //your user name is stored in the session
    req.session.user = username;
    return res.redirect("/dashboard");
  } else {
    return res.send("<h1>Invalid credentials ❌</h1><a href='/'>Try Again</a>");
  }
});

// Protected route (only logged-in users can access)
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

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);

//In this project I dont use nocache.So if I logout from the page,and click the back icon I will again enter in to the logged page.
