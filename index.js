const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { connection } = require("./db");
const { userRouter } = require("./routes/User.route");
const { postRouter } = require("./routes/Post.route");
const { auth } = require("./middleware/auth.middleware")

const app = express();
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/posts", auth);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
    res.send("Home Page")
})

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("connected to DB")
    } catch (err) {
        console.log(err.message)
    }
    console.log(`server is running at port ${process.env.port}`)
})