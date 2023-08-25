const express = require("express");
const app = express();
var cors = require("cors");
const middleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// routs imports
const product = require("./routes/productRout");
const user = require("./routes/userRout");
const order = require("./routes/orderRout");
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// middleware for error
app.use(middleware);

module.exports = app;
