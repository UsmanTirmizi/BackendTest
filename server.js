import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import EmployeeRoute from "./routes/EmployeeRoute.js";


//configure env
dotenv.config();

//DB connection
mongoose
    .connect("mongodb+srv://Web-Crud:Meraghar80.@cluster0.grfiasw.mongodb.net/")
    .then(() => console.log("Dbconnection sucessfull"))
    .catch((err) => {
        console.log(err);
    });


//rest object
const app = express();

//middelwares
app.use(express.json());

//routes
app.use("/api/Em", EmployeeRoute);

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});