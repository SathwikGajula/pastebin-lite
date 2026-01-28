require("dotenv").config();
const app = require("./app");
const pool = require("./db");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);

  pool.query("SELECT 1")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error", err));
});
