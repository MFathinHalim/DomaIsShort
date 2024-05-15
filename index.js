"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./routes/api"); //* Import api router
var mongoose_1 = require("mongoose"); //? import mongoosenya
//Import modul-modul yang dibutuhkan
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config(); //! Config envnya :3
//Persiapan Servernya
var server = express();
var port = process.env.PORT || 3000; //Port dari env atau 3000
server.set("view engine", "ejs"); //Set view engine
server.set("views", __dirname + "/views"); //set the dictionary
server.use(express.static(path.join(__dirname, "/public"))); //set the client dictionary
server.use(bodyParser.urlencoded({
    extended: true,
})); //buat body parser encoded
var myMiddleware = function (req, res, next) {
    // Lakukan tugas middleware di sini
    next(); // Panggil next() untuk melanjutkan ke middleware berikutnya atau ke penanganan rute
};
server.use(myMiddleware);
server.use(bodyParser.json()); //jsonnya
server.use(cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
})); //buat cors, biar bisa kepake dimana aja (Kalau sewaktu waktu mau bikin ke react)
//Pake router dari /routes/api.ts
server.use(api_1.default);
//Bikin URI dari .env
var uri = process.env.MONGODBURI;
//connect
server.listen(port, function () {
    console.log("[app]: app is running on port ".concat(port));
    mongoose_1.default.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    });
});
