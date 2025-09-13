const express = require("express");
const dbconnection = require("./config/DbConnection");
const app = express();
const cors = require("cors");
const bodyParser = require ("body-parser");
//routes
const router = require("./routes/Users");

app.use(cors({ origin: true, credentials: true }));

//dbconnection
 dbconnection();

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("HELLOW WORLD..."));
app.use("/api/users", router);

const PORT = 3000;
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));