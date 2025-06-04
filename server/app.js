require("dotenv").config();
const express = require("express");
const http = require("http");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const connectDB = require("./utils/connectDB.js");

const stockRoutes = require("./routes/stock.routes.js");

const app = express();
const server = http.createServer(app);

// no need of these packages for now
// Enable CORS for required origins
// app.use(cors());

// app.use(express.json());
// app.use(cookieParser());

// API ROUTES
app.get("/test", (req, res) => {
  res.status(200).json({ message: "API is working! Lets Go" });
});

app.use("/", stockRoutes);

// not used database so comment
// connectDB();

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
