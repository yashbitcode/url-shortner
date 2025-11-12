const express = require("express");
const PORT = process.env.PORT ?? 8000;
const authRouter = require("./routes/auth.routes");
const { authMiddleware } = require("./middlewares/auth.middlewares");

const app = express();

app.use(express.json());
app.use(authMiddleware);

app.use("/", authRouter);

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));