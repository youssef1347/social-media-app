const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`app is runinng on port ${PORT}`);
});

connectDatabase();