const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/auth", require("./router/jwAuth"));
app.use("/input", require("./router/input"));
app.listen(5000, () => {
  console.log("Server listening to port 5000");
});
