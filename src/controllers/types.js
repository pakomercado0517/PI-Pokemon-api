const axios = require("axios");
const { Type } = require("../db");

module.exports = {
  getTypes: async () => {
    try {
      const types = await axios.get("https://pokeapi.co/api/v2/type");
      const totalTypes = types.data.results.map((el) => el.name);
      totalTypes.map(async (el) => await Type.create({ name: el }));
      return console.log("types created on DB successfully");
    } catch (error) {
      console.log(error.message);
    }
  },
  getTypesDB: async (req, res) => {
    try {
      const typesDB = await Type.findAll();
      res.status(200).json(typesDB);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
