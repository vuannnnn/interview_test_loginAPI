const router = require("express").Router();
const authController = require("../controllers/authController");

router.use((req, res, next) => {
  console.log("正在接收一個與auth相關的請求...");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結...");
});

// 註冊
router.post("/register", authController.register);

// 登入
router.post("/login", authController.login);

module.exports = router;
