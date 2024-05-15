import type { Express, NextFunction } from "express"; //Import tipe data dari module Express
import router from "./routes/api"; //* Import api router
import mongoose from "mongoose"; //? import mongoosenya

//Import modul-modul yang dibutuhkan
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); //! Config envnya :3

//Persiapan Servernya
const server: Express = express();
const port: number | string = process.env.PORT || 3000; //Port dari env atau 3000

server.set("view engine", "ejs"); //Set view engine
server.set("views", __dirname + "/views"); //set the dictionary
server.use(express.static(path.join(__dirname, "/public"))); //set the client dictionary
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
); //buat body parser encoded
const myMiddleware: any = (req: Request, res: Response, next: NextFunction) => {
  // Lakukan tugas middleware di sini
  next(); // Panggil next() untuk melanjutkan ke middleware berikutnya atau ke penanganan rute
};

server.use(myMiddleware);

server.use(bodyParser.json()); //jsonnya
server.use(
  cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
  })
); //buat cors, biar bisa kepake dimana aja (Kalau sewaktu waktu mau bikin ke react)

//Pake router dari /routes/api.ts
server.use(router);

//Bikin URI dari .env
const uri: string | any = process.env.MONGODBURI;
//connect
server.listen(port, () => {
  console.log(`[app]: app is running on port ${port}`);
  mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
});
