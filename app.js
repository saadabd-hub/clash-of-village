const express = require("express");
const mongooseConnect = require("./config/db");
const router = require("./router");
const app = express();
const PORT = 3000;

mongooseConnect();
// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});