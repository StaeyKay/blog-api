import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import expressOasGenerator from "@mickeymond/express-oas-generator"
import { dbConnection } from "./config/db.js";
import userRouter from "./routes/user_route.js";
import articleRouter from "./routes/article_route.js";


const app = express();

expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ['auth', 'articles'],
    mongooseModels: mongoose.modelNames()
})

// Connect to the database
dbConnection();

// Apply middleware
app.use(express.json());
app.use(cors({Credentials: true, origin: '*'}));

// Use routes
app.use('/api/v1', userRouter)
app.use('/api/v1', articleRouter)

expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect('/api-docs/')) 

const PORT = process.env.PORT || 7000

// Listen for incoming requests
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})