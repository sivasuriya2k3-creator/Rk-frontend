import express from "express";

const app = express();

const PORT = process.env.PORT;

console.log("BOOT OK");
console.log("PORT =", PORT);

app.listen(PORT, "0.0.0.0", () => {
  console.log("LISTENING ON", PORT);
});
