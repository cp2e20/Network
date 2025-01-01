const bcrypt = require("bcryptjs");

const generateHashedPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);
};

generateHashedPassword("password123");
