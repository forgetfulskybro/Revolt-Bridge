const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    Did: { type: String },
    Rid: { type: String },
});

module.exports = mongoose.model("revoltMsgs", Schema); 
