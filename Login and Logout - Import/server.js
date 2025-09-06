import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Fake user (normally from DB)
const USER = { username: "admin", password: "1234" };

// Serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// Handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.send(`<h1>Welcome, ${username} 🎉</h1>
      <a href="/logout">Logout</a>`);
  } else {
    return res.send("<h1>Invalid credentials ❌</h1><a href='/'>Try Again</a>");
  }
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
