const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const config = require("./config/detabas");
const authRoute = require("./routes/auth");
const cors = require("cors");
const passport = require("passport");
require("./config/passport")(passport);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRoute);

app.get("/test", (req, res) => {
  res.json({ message: "test work!!" });
});

// 從 config.json 讀取資料庫設定
const dbConfig = config.development;

app.listen(1004, () => {
  console.log("後端伺服器正在聆聽 port 1004...");
});

// 部署到Vercel
module.exports = app;
