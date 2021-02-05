const jwt = require("jsonwebtoken");
const jwtSecret = "otp";

function jwtOtp(otp) {
  const payload = {
    user: otp,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: Math.floor(Date.now() / 1000) + 5 * 60,
  });
}

module.exports = jwtOtp;
