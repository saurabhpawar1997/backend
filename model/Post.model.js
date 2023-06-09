const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title : String,
    body : String,
    device : String,
    no_if_comments : Number,
    userID:String
},{
    versionKey:false
})

const PostModel = mongoose.model("user_post",postSchema);

module.exports = {PostModel};