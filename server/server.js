const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true  
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ msg: "Welcome to the server!"});
})


// Routes
app.use('/user' , require('./routes/userRouter'));
app.use('/api' , require('./routes/categoryRouter'));
app.use('/api' , require('./routes/productRouter'));







const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});

