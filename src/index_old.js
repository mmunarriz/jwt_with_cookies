import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import authorization from './src/controllers/auth';


const app = express();
app.use(cookieParser());

app.get("/", (req, res) => {
    return res.json({ message: "Hello World 🇵🇹 🤘" });
});

app.get("/login", (req, res) => {
    const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
    return res
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ message: "Logged in successfully 😊 👌" });
});

app.get("/protected", authorization, (req, res) => {
    return res.json({ user: { id: req.userId, role: req.userRole } });
});

app.get("/logout", authorization, (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out 😏 🍀" });
});

const start = (port) => {
    try {
        app.listen(port, () => {
            console.log(`Api up and running at: http://localhost:${port}`);
        });
    } catch (error) {
        console.error(error);
        process.exit();
    }
};
start(5000);