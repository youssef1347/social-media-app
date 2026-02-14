const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { rateLimit } = require("express-rate-limit");
dotenv.config();


const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(limiter);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("API is running...");
});


app.listen(PORT, () => {
    console.log(`app is runinng on port ${PORT}`);
});

connectDatabase();