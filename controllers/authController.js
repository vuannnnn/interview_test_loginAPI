const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models").User;
const { registerValidation, loginValidation } = require("../validation");
const config = require("../config/config");

const sendData = (message, state, data = {}) => {
  return {
    message,
    state,
    data,
  };
};

// 註冊
const register = async (req, res) => {
  console.log(req.body);

  // 規範驗證
  let { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(sendData(error.details[0].message, "1"));
  }

  // 檢查密碼長度
  if (req.body.password.length < 8 || req.body.password.length > 20) {
    return res.status(400).send(sendData("密碼長度必須在 8 到 20 之間", "1"));
  }

  // 確認信箱是否已註冊過
  const emailExist = await User.findOne({ where: { email: req.body.email } });
  if (emailExist)
    return res
      .status(200)
      .send(sendData("此信箱已被註冊，請使用登入系統...", "1"));

  // 創建新用戶
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser = new User({ email, password: hashedPassword });

  try {
    let saveUser = await newUser.save();
    return res.send(sendData("註冊成功！", "0", saveUser));
  } catch (e) {
    console.log(e.message);
    return res.status(500).send(sendData("註冊失敗...", "1"));
  }
};

// 登入
const login = async (req, res) => {
  // 規範驗證
  let { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(sendData(error.details[0].message, "1"));
  }

  // 確認是否註冊過
  const foundUser = await User.findOne({ where: { email: req.body.email } });
  if (!foundUser) {
    return res
      .status(401)
      .send(sendData("無法找到使用者，請先確認信箱是否正確", "1"));
  }

  // 比對密碼
  try {
    const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
    if (!isMatch) {
      return res.status(401).send(sendData("密碼錯誤，請重新輸入！", "1"));
    }
  } catch (e) {
    console.error("比對密碼時發生錯誤:", e);
    return res.status(200).send(sendData("密碼比對錯誤", "1"));
  }

  // JWT
  const tokenObject = { email: foundUser.email };
  const token = jwt.sign(tokenObject, config.development.passportSecret, {
    expiresIn: "24h",
  });

  return res.send({
    message: "登入成功！",
    state: "0",
    token: "JWT " + token,
    user: foundUser,
  });
};

module.exports = {
  register,
  login,
};
