const { Router } = require("express");
const router = Router();
const pokemonFunctions = require("../controllers/pokemon");

//GET methods
router.get("/", pokemonFunctions.getPokemons);
router.get("/:id", pokemonFunctions.getById);
router.get("/filterName/ASC", pokemonFunctions.getNameASC);
router.get("/filterName/DESC", pokemonFunctions.getNameDESC);
router.get("/filterHp/ASC", pokemonFunctions.getForceASC);
router.get("/filterHp/DESC", pokemonFunctions.getForceDESC);
router.get("/api_information/:name", pokemonFunctions.getPokemonInformation);
router.get("/filterType/:type", pokemonFunctions.filterType);

//POST methods
router.post("/", pokemonFunctions.createPokemon);

module.exports = router;
