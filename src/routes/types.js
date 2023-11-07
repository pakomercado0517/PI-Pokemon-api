const { Router } = require("express");
const typesFunctions = require("../controllers/types");

const router = Router();

router.get("/", typesFunctions.getTypesDB);

module.exports = router;
