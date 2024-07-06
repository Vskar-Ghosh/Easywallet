const express = require("express");
require("dotenv").config();
require("./config/dbConfig");
const userRoutes = require("./routes/usersRoutes");
const transactionsRoute = require("./routes/transactionsRoute");
const requestsRoute = require("./routes/requestsRoute");

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionsRoute);
app.use("/api/requests", requestsRoute);

const path = require("path");
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`server is running at port:${port}`);
});
