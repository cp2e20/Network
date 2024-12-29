const mongoose = require("mongoose");
const User = require("./models/User");
const Craftsman = require("./models/Craftsman");
const Announcement = require("./models/Announcement");
const Applicant = require("./models/Applicant");

// Connect to MongoDB
mongoose
  .connect("YOUR_MONGO_URI", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Example: Creating a new user
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body); // Ensure req.body is validated
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});
