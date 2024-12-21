const Joi = require("joi");

//註冊驗證
const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "電子郵件格式錯誤",
      "any.required": "未輸入電子郵件",
    }),
    password: Joi.string().required().messages({
      "any.required": "未輸入填入密碼",
    }),
  });
  return schema.validate(data);
};

//登入驗證
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "電子郵件格式錯誤",
      "any.required": "未輸入電子郵件",
    }),
    password: Joi.string().min(8).max(20).required().messages({
      "string.min": "密碼長度不能少於8字元",
      "string.max": "密碼長度不能超過20字元",
      "any.required": "未輸入填入密碼",
    }),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
