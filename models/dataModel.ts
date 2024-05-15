//Ini data model
import type { Schema as SchemaType } from "mongoose"; //import tipe dari mongoose

const { Schema, model } = require("mongoose"); //import schema dan model

const dataSchema: SchemaType = new Schema({
  original: String,
  short: String,
}); // bikin schema baru

module.exports = {
  dataModel: model("dsct", dataSchema),
}; //* Di export
