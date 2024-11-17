import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import { config } from "./config/envConfig";

import authRouter from "./routes/authRouter";
import organizationRouter from "./routes/organizationRouter";
import attackerRouter from "./routes/attackerRouter";
import defenderRouter from "./routes/defenderRouter";
import { authMiddleware } from "./middleware/authMiddleware";
import { errorMiddleware } from "./middleware/errorHandler";

connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", authRouter);
app.use("/api/organization", organizationRouter);
app.use(authMiddleware);

app.use("/api/attacker", attackerRouter);
app.use("/api/defender", defenderRouter);

// app.use(errorMiddleware);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
