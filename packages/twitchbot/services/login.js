const axios = require("axios");

async function login() {
  try {
    let response = await axios.post(
      "http://localhost:8081/auth/login",
      {
        username: process.env.API_LOGIN_USERNAME,
        password: process.env.API_LOGIN_PW,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let token = response.data.data.token;
    return token;
  } catch (error) {
    throw new Error(error.response);
  }
}

module.exports = { login };
