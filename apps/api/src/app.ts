import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth.routes";
import { lessonRouter } from "./routes/lesson.routes";
import { walletRouter } from "./routes/wallet.routes";
import { paymentRouter, paymentWebhookRouter } from "./routes/payment.routes";
import { crmRouter } from "./routes/crm.routes";
import { homeworkRouter } from "./routes/homework.routes";
import { resourceRouter } from "./routes/resource.routes";
import { reviewRouter } from "./routes/review.routes";
import { adminRouter } from "./routes/admin.routes";
import { tutorRouter } from "./routes/tutor.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(pinoHttp({ logger }));

// Stripe webhook needs the raw body — must be mounted before express.json().
app.use("/api/payments/webhook", paymentWebhookRouter);

app.use(express.json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/crm", crmRouter);
app.use("/api/homework", homeworkRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/api/tutors", tutorRouter);

app.use(errorHandler);
