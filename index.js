import express from "express"
import 'dotenv/config'
import authRouter from "./routes/authRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});





