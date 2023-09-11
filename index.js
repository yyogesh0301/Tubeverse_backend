import express, { application } from "express"
import path from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import videoRoutes from "./routes/videos.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from "cors"


const __filename=fileURLToPath(import.meta.url);
const __dirname=(__filename);


const app = express();
dotenv.config();
app.use(cors({
  origin:"*",
  credentials: true,
}));

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};

 app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("test api");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// app.use(express.static(path.join(__dirname,"../../client/build")));
// app.get("*",(req,res)=>{
//   res.sendFile(path.resolve(__dirname,"../../client/build/index.html"));
// })


app.use((err,req,res,next)=>{
    const status =err.status || 500;
    const message =err.message || "Something went wrong !";
    return res.status(status).json({
        success:false,
        status,
        message
    })

})

app.listen(5000,()=>{
    connect();
    console.log("Connected to Server !")
})