const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
    "/customer",
    session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }),
);

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log(req.session);

    // Check if authorization exists in session
    if (req.session.authorization) {
        const { accessToken, username } = req.session.authorization;

        // Verify the JWT token
        try {
            const decoded = jwt.verify(accessToken, "access");
            // Token is valid, proceed
            req.user = { username }; // Optional: attach user info to request
            next();
        } catch (error) {
            // Token is invalid or expired
            res.status(401).send("Unauthorized - Invalid or expired token");
        }
    } else {
        res.status(401).send("Unauthorized - No authentication token");
    }
});

const PORT = 5002;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
