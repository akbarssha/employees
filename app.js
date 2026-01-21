const express = require("express");
const app = express();
const employeeRoutes = require("./routes/employeeRoutes");


app.use(express.json());
app.use("/api/employees",employeeRoutes);

module.exports =app;
