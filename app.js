import { PORT, MONGO_URI, FRONTEND_URI } from "./config/index.js";
import router from "./routes/index.js";
import express from "express";
import mongoose from "mongoose";

const app = express()

// handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", FRONTEND_URI);
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

// Connect database
mongoose.set("strictQuery", false);
mongoose
    .connect(MONGO_URI)
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

// Connect route handler
router(app);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

