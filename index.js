const express = require("express");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const general_routes = require("./router/general.js").general;
const jwt = require('jsonwebtoken');


const app = express();

app.use(express.json());

// ✅ Setup session middleware
app.use(
  session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Authorization middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization.token;
    jwt.verify(token, "fingerprint_customer", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authorized" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", general_routes);

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
