var express = require("express");
var router = express.Router();

/* GET home page. */
// create route
router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.render("index", { title: "Express" });
});

module.exports = router;
