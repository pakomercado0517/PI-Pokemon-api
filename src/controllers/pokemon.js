const axios = require("axios");
const { Pokemon, Type } = require("../db");
const { API_URL } = process.env;

module.exports = {
  createPokemonsAPI: async function () {
    try {
      const isPokemons = await Pokemon.findAll({ include: { model: Type } });
      if (isPokemons.length) return isPokemons;
      const first_items = await axios.get(`${API_URL}`);
      const second_items = await axios.get(first_items.data.next);
      const allPokemons = await first_items.data.results.concat(
        second_items.data.results
      );

      const pokemonData = allPokemons.map(
        async (el) => await axios.get(el.url)
      );
      await Promise.all(pokemonData).then((data) =>
        data.map(async (el) => {
          const pokeElement = el.data;
          const pokemonItem = await Pokemon.create({
            id: pokeElement.id,
            name: pokeElement.name,
            hp: pokeElement.stats[0].base_stat,
            attack: pokeElement.stats[1].base_stat,
            defense: pokeElement.stats[2].base_stat,
            speed: pokeElement.stats[5].base_stat,
            height: pokeElement.height,
            weight: pokeElement.weight,
            sprite: pokeElement.sprites.other.dream_world.front_default,
          });
          await Promise.all(pokeElement.types).then((element) => {
            element.map(async (item) => {
              const pokemonType = await Type.findOne({
                where: { name: item.type.name },
              });
              await pokemonType.addPokemon(pokemonItem);
            });
          });
        })
      );
      console.log("Pokemons from API created on DB succesfully");
    } catch (error) {
      console.log(error);
    }
  },

  createPokemon: async (req, res) => {
    const {
      id,
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      sprite,
      types,
    } = req.body;
    try {
      const pokemon = await Pokemon.create({
        id,
        name,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
        sprite,
      });
      types.map(async (element) => {
        const typesDB = await Type.findOne({ where: { name: element } });
        await typesDB.addPokemon(pokemon);
      });
      res.status(200).json(pokemon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getPokemons: async function (req, res) {
    try {
      const pokeDB = await Pokemon.findAll({ include: { model: Type } });
      res.status(200).json(pokeDB);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },
  getById: async function (req, res) {
    const { id } = req.params;
    try {
      const pokemon = await Pokemon.findAll({
        where: { id },
        include: { model: Type },
      });
      if (!pokemon) return res.status(404).send("Pokemon not found");
      res.status(200).json(pokemon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // get information for create a new pokemon on DB
  getPokemonInformation: async function (req, res, next) {
    const { name } = req.params;
    try {
      const pokemonDB = await Pokemon.findOne({ where: { name } });
      if (pokemonDB)
        return res.send({ message: "Warning!, Pokemon exist on DB" });
      const searchPokemon = await axios.get(`${API_URL}/${name}`);
      const pokemon = searchPokemon.data;
      !searchPokemon
        ? res.status(404).send("Pokemon not found")
        : res.status(200).json({
            id: pokemon.id,
            name: pokemon.name,
            hp: pokemon.stats[0].base_stat,
            attack: pokemon.stats[1].base_stat,
            defense: pokemon.stats[2].base_stat,
            speed: pokemon.stats[5].base_stat,
            height: pokemon.height,
            weight: pokemon.weight,
            sprite: pokemon.sprites.other.dream_world.front_default,
            types: pokemon.types.map((el) => el.type.name),
          });
    } catch (error) {
      res.status(400).json({ message: error.message });
      next(error);
    }
  },
  getNameASC: async function (req, res) {
    try {
      const asc = await Pokemon.findAll({
        order: [["name", "ASC"]],
        include: { model: Type },
      });
      res.status(200).json(asc);
    } catch (error) {
      res.status(400).json({ message: `el error es: ${error}` });
    }
  },
  getNameDESC: async function (req, res) {
    try {
      const desc = await Pokemon.findAll({
        order: [["name", "DESC"]],
        include: { model: Type },
      });
      res.status(200).json(desc);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getForceASC: async function (req, res) {
    try {
      const asc = await Pokemon.findAll({
        order: [["hp", "ASC"]],
        include: { model: Type },
      });
      res.status(200).json(asc);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getForceDESC: async function (req, res) {
    try {
      const asc = await Pokemon.findAll({
        order: [["hp", "DESC"]],
        include: { model: Type },
      });
      res.status(200).json(asc);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  filterType: async function (req, res) {
    const { type } = req.params;
    try {
      const filterType = await Type.findAll({
        where: { name: type },
        include: { model: Pokemon },
      });
      res.status(200).json(filterType);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
