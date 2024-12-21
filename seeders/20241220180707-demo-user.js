"use strict";

// 用來生成隨機密碼的函式
function generateRandomPassword(length = 8) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 建立 10 個使用者
    var userArray = [];

    for (let i = 1; i <= 10; i++) {
      const user = {
        email: `fake${i}@gmail.com`,
        password: generateRandomPassword(10),
      };
      userArray.push(user);
    }

    return queryInterface.bulkInsert("Users", userArray);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
