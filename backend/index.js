const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb://localhost:27017";


if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined. Check your .env file.");
  process.exit(1); // Stop execution if no URI is found
}

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mern_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Routes
app.use("/api/meetings", require("./routes/meetings"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/