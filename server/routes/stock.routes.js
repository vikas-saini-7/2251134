const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stock.controller.js");

router.get("/stocks/:ticker", stockController.getStocks);
router.get("/stockcorrelation", stockController.getCorrelation);

module.exports = router;
