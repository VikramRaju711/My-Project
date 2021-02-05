const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const { encrypt, decrypt } = require("../middleware/encrypt");
const jwtOtp = require("../utils/jwtotp");
const otpauthorize = require("../middleware/otpauthorize");

router.post("/register", validInfo, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await pool.query("SELECT * FROM USERS WHERE email =$1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.json("User already exists");
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO USERS(firstname,lastname,email,password) VALUES ($1,$2,$3,$4) RETURNING*",
      [firstName, lastName, email, bcryptPassword]
    );

    const token = jwtGenerator(newUser.rows[0].id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.json("Password or Email is incorrect");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.json("Password or Email is incorrect");
    }

    const token = jwtGenerator(user.rows[0].id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/is-verify", authorization, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/otp-verify", otpauthorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/encrypted", async (req, res) => {
  try {
    const { message, id } = req.body;

    // const user = await pool.query(
    //   "UPDATE USERS SET message=($1) WHERE id=($2) RETURNING*",
    //   [message, id]
    // );
    //"INSERT INTO Hash (id,encrypt_iv,encrypt_content,otp) VALUES($1,$2,$3,$4) RETURNING*",
    const hash = encrypt(message);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await pool.query(
      "UPDATE USERS SET encrypt_iv=($1),encrypt_content=($2),otp=($3) WHERE id=($4) RETURNING*",
      [hash.iv, hash.content, otp, id]
    );
    const token2 = jwtOtp(otp);
    const token = Math.floor(100000 + Math.random() * 90000000000000);
    res.json({ otp, token, token2 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/decrypted", async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await pool.query("SELECT * FROM USERS WHERE otp=($1)", [otp]);
    const text = decrypt(user.rows[0].encrypt_iv, user.rows[0].encrypt_content);
    res.json({ text });
    // const newuser = await pool.query(
    //   "UPDATE USERS SET encrypt_iv='',encrypt_content='',otp=0 where id=($1)",
    //   [id]
    // );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/validateotp", async (req, res) => {
  try {
    const { id, otp } = req.body;

    const user = await pool.query("SELECT * FROM USERS WHERE id=($1)", [id]);
    if (user.rows[0].otp === otp) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
