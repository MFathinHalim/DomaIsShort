//import tipe data router sebagai routerType
import type {
  Router as routerType,
  Request,
  Response,
  NextFunction,
} from "express";
import type { dataType } from "../types/dataType";

const { Router } = require("express");
const { dataModel } = require("../models/dataModel"); //import model dari datanya :3
const { v4: uuidv4 } = require("uuid"); //? yang ini import uuid buat randomize
const axios = require("axios"); //import axios buat fetch data Captcha
const dotenv = require("dotenv");
dotenv.config();

let data: dataType[] = [];
dataModel
  .find({}) //dapatin semua datanya ( 0w0 )
  .then((docs: dataType[]) => {
    data = docs;
    data.push({
      original: "https://www.fathin.my.id",
      short: "fathin",
    });
  })
  .catch((error: Error) => {
    console.error(error);
  });

const router: routerType = Router(); //Bikin routernya

//? Router buat '/'
router
  .route("/")
  .get((req: Request, res: Response, next: NextFunction) => {
    //ini buat get
    const { short }: any = req.query; //dapatin ?short=
    const isThereInData: dataType | undefined = data.find(
      (entry) => entry.short == short
    ); //cek dulu ada atau enggak
    if (isThereInData) res.status(200).render("redirect", { isThereInData });
    res.status(404).render("not-found"); //gak ketemu
    next();
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    //captcha dulu abangkuh
    const token: any = req.body["g-recaptcha-response"];
    const response: any = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`
    ); //fetch datanya dulu :3
    if (!response.data.success) {
      res.json({ msg: "reCAPTCHA tidak valid" }); //! Kalau misalnya error, maka dia kirim reCAPTCHA tidak valid
      next(); //? next
    }
    //buat post
    const original: any = req.body.original;
    //lalu bikin shortnya uuidv4
    let short: string = Buffer.from(uuidv4(), "hex").toString("base64"); //habis dibikin, di convert ke base64
    const isThereInData: dataType | undefined = data.find(
      (entry) => entry.original == original
    ); //kayak tadi, di cek ada gak(bedanya ini original)
    if (isThereInData)
      //kalau ada
      res.status(200).render("redirect", { isThereInData });
    const result: dataType = {
      original,
      short,
    }; // ini hasilnya nanti dikumpulin
    data.push(result);
    await dataModel.create(result);
    res.status(200).render("redirect", { isThereInData: result });
    next();
  });

router.get("/home", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).render("home", { data: data }); //buat /home :3
  next();
});

router.get("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render("not-found"); //kalau nyasar pagenya, dia ke 404 not found
  next();
});

module.exports = router; //* Export hasilnya
