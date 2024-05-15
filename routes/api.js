"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Router = require("express").Router;
var dataModel = require("../models/dataModel").dataModel; //import model dari datanya :3
var uuidv4 = require("uuid").v4; //? yang ini import uuid buat randomize
var data = [];
dataModel
    .find({}) //dapatin semua datanya ( 0w0 )
    .then(function (docs) {
    data = docs;
    data.push({
        original: "https://www.fathin.my.id",
        short: "fathin",
    });
})
    .catch(function (error) {
    console.error(error);
});
var router = Router(); //Bikin routernya
//? Router buat '/'
router
    .route("/")
    .get(function (req, res, next) {
    next();
    //ini buat get
    var short = req.query.short; //dapatin ?short=
    var isThereInData = data.find(function (entry) { return entry.short == short; }); //cek dulu ada atau enggak
    if (isThereInData)
        return res.status(200).render("redirect", { isThereInData: isThereInData });
    return res.status(404).render("not-found"); //gak ketemu
})
    .post(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var original, short, isThereInData, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                next();
                original = req.body.original;
                short = Buffer.from(uuidv4(), "hex").toString("base64");
                isThereInData = data.find(function (entry) { return entry.original == original; });
                if (isThereInData)
                    //kalau ada
                    return [2 /*return*/, res.status(200).render("redirect", { isThereInData: isThereInData })];
                result = {
                    original: original,
                    short: short,
                };
                data.push(result);
                return [4 /*yield*/, dataModel.create(result)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).render("redirect", { isThereInData: result })];
        }
    });
}); });
router.get("/home", function (req, res, next) {
    next();
    res.status(200).render("home", { data: data }); //buat /home :3
});
router.get("*", function (req, res, next) {
    next();
    res.status(404).render("not-found"); //kalau nyasar pagenya, dia ke 404 not found
});
exports.default = router; //* Export hasilnya
