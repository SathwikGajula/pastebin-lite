const express = require("express");
const pasteController = require("../controllers/pasteController");

const router = express.Router();


router.get("/:id", pasteController.getPasteHtml);

module.exports = router;
