const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const pasteRoutes = require("./routes/pasteRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

app.use("/api/healthz", healthRoutes);
app.use("/api/pastes", pasteRoutes);
app.use("/p", htmlRoutes);

module.exports = app;
