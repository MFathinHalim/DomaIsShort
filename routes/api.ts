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
    next();
    //ini buat get
    const { short }: any = req.query; //dapatin ?short=
    const isThereInData: dataType | undefined = data.find(
      (entry) => entry.short == short
    ); //cek dulu ada atau enggak
    if (isThereInData)
      return res.status(200).render("redirect", { isThereInData });
    return res.status(404).render("not-found"); //gak ketemu
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    next();
    //buat post
    const original: any = req.body.original;
    //lalu bikin shortnya uuidv4
    let short: string = Buffer.from(uuidv4(), "hex").toString("base64"); //habis dibikin, di convert ke base64
    const isThereInData: dataType | undefined = data.find(
      (entry) => entry.original == original
    ); //kayak tadi, di cek ada gak(bedanya ini original)
    if (isThereInData)
      //kalau ada
      return res.status(200).render("redirect", { isThereInData });
    const result: dataType = {
      original,
      short,
    }; // ini hasilnya nanti dikumpulin
    data.push(result);
    await dataModel.create(result);
    return res.status(200).render("redirect", { isThereInData: result });
  });

router.get("/home", (req: Request, res: Response, next: NextFunction) => {
  next();
  res.status(200).render("home", { data: data }); //buat /home :3
});

router.get("*", (req: Request, res: Response, next: NextFunction) => {
  next();
  res.status(404).render("not-found"); //kalau nyasar pagenya, dia ke 404 not found
});

export default router; //* Export hasilnya
