const mongoose = require("mongoose");

const mongooseConnect = () => {
    mongoose.connect("mongodb://localhost:27017/clash-of-village", {
        useNewUrlParser: true,
        useCreateIndex : true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection Error"));
    db.once("open", function(){
        console.log("Connected to Database")
    });
}
module.exports = mongooseConnect;