const express = require("express");
const pasteController = require("../controllers/pasteController");

const router = express.Router();


router.post("/", pasteController.createPaste);
router.get("/:id", pasteController.getPasteApi);


module.exports = router;
