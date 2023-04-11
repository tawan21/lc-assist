import express from "express";
import cors from "cors";
import router from "./routes/leetcode.js"

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/lc", router)

app.listen(3000, () => {
  console.log("listening on port 3000");
});