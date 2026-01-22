const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: '*', credentials: true}));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("API is running...");
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`app is runinng on port ${PORT}`);
});

connectDatabase();