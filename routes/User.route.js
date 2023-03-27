const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/User.model");

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
    const payload = req.body;
    const { password } = payload;

    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.send({ msg: "something went wrong", error: err.message });
            } else {
                const user = new UserModel({ ...payload, password: hash });
                await user.save();
                res.send({ msg: "new user has been registered" });
            }
        });
    } catch (err) {
        res.send({ msg: "something went wrong", error: err.message });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, "masai");
                    res.send({ msg: "Logined successfully", token: token });
                } else {
                    res.send({ msg: "wrong credientials" });
                }
            });
        } else {
            res.send({ msg: "wrong credientials" });
        }
    } catch (err) {
        res.send({ msg: "something went wrong", error: err.message });
    }
});

module.exports = { userRouter };
