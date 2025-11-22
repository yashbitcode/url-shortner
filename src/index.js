require("dotenv/config");
const express = require("express");
const PORT = process.env.PORT ?? 8000;

const { authMiddleware } = require("./middlewares/auth.middlewares");
const { authRouter, urlRouter } = require("./routes");

const app = express();

app.use(express.json());
app.use(authMiddleware);

app.use("/", authRouter);
app.use("/url", urlRouter);

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));