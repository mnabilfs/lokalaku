const express = require("express");
const app = express();
const usersRoute = require("./routes/users");
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/users", usersRoute);

app.listen(port);
console.log(`Server berjalan di http://localhost:${port}`);
