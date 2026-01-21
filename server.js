require("dotenv").config();

const app = require("./app.js");
const connectDB = require("./config/db.js");


connectDB();

app.listen(3022, () => console.log("Server running on port 3022"));