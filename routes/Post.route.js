const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PostModel } = require("../model/Post.model");

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
    const query = req.query;
    const userID = req.body.userID;
    let posts;
    try {
        if (query.device) {
            posts = await PostModel.find({ device: query.device });
        }
        else if (query.device1 && query.device2) {
            posts = await PostModel.find({ $and: [{ device1: query.device1 }, { device2: query.device2 }] });
        }
        else {
            posts = await PostModel.find({ userID: userID });
        }

        res.send(posts);
    } catch (err) {
        res.send({ "msg": "cannot get the post", "error": err.message })
    }
})

postRouter.post("/add", async (req, res) => {
    const payload = req.body;
    try {
        const post = new PostModel(payload);
        await post.save();
        res.send({ "msg": "post had been posted" });
    } catch (err) {
        res.send({ "msg": "cannot post the post", "error": err.message })
    }
})

postRouter.patch("/update/:id", async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    const post = await PostModel.find({ "_id": ID })
    let userID_in_post = post.userID;
    let userID_making_req = req.body.userID;
    try {
        if (userID_in_post !== userID_making_req) {
            res.send({ "msg": "you are not authorized" });
        } else {
            await PostModel.findByIdAndUpdate({ "_id": ID }, payload);
            res.send({ "msg": `Post with id ${ID} has been updated` });
        }

    } catch (err) {
        res.send({ "msg": "cannot update the post", "error": err.message })
    }
})

postRouter.delete("/delete/:id", async (req, res) => {
    const ID = req.params.id;
    const post = await PostModel.find({ "_id": ID })
    let userID_in_post = post.userID;
    let userID_making_req = req.body.userID;
    try {
        if (userID_in_post !== userID_making_req) {
            res.send({ "msg": "you are not authorized" });
        } else {
            await PostModel.findByIdAndDelete({ "_id": ID });
            res.send({ "msg": `Post with id ${ID} has been deleted` });
        }

    } catch (err) {
        res.send({ "msg": "cannot delete the post", "error": err.message })
    }
})

module.exports = { postRouter }