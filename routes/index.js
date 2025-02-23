var express = require("express");
var router = express.Router();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.status(200).send("Welcome to CoderSchool!");
// });

/* Pokemon router */
const pokemonRouter = require("./pokemon.api.js"); // Import router Pokemon
router.use("/pokemons", pokemonRouter); // Tạo route mới cho Pokemon

module.exports = router;
