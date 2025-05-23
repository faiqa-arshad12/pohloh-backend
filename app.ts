import express from "express";
import cors from "cors";
import onboardingRoutes from "./src/routes/organization.routes";
import usersRoutes from "./src/routes/users.routes";
import subscriptionRoutes from "./src/routes/subscription.routes";
import teamRoutes from "./src/routes/team.routes";
import stripeRoutes from "./src/routes/stripe.routes";
import subCategoryRoutes from "./src/routes/subcategory.routes";
import KnowledgeCardRoutes from "./src/routes/knowledge-card.routes";
import AnnouncemnetsRoutes from "./src/routes/announcement.routes";
import LearningPathRoutes from "./src/routes/learning-path.routes";
import FeedbackRoutes from "./src/routes/feedback.routes";
const app = express();
app.use(
  cors({
    origin: "*", // Accept all origins
    credentials: true,
  })
);

// ✅ Handle preflight requests for all routes
app.options("*", cors());

// Parse incoming requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Enable CORS
// app.use(
//   cors({
//     // origin: "http://localhost:3000",
//     origin:"https://pohloh-hkhxshisd-faiqa-s-projects.vercel.app",
//     credentials: true,
//   })
// );

// // Parse incoming JSON
// app.use(express.json());

// // Parse incoming JSON and URL-encoded data with increased payload limits
// // Before any routes
// app.use(express.json({limit: "50mb"}));
// app.use(express.urlencoded({limit: "50mb", extended: true}));

// API routes
app.use("/api/organizations", onboardingRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/sub-categories", subCategoryRoutes);
app.use("/api/cards", KnowledgeCardRoutes);
app.use("/api/announcements", AnnouncemnetsRoutes);
app.use("/api/learning-paths", LearningPathRoutes);
app.use("/api/feedbacks", FeedbackRoutes);

export default app;
