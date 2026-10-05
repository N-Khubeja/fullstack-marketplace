require("dotenv").config();


const express = require("express");
const app = express();
const connectDB = require("./config/db");

const useRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const authRoutes = require("./routes/authRoutes")
const cookieParser = require("cookie-parser");
const cors = require("cors");

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

app.use((req,res,next) => {
    const url = req.url
    if(url === "/blocked"){
      return res.send("Access denied")
    }

    next()
})


app.use((req, res, next) => {
  console.log(`Method: ${req.method}, URL: ${req.url}`);
  next();
});


app.get("/", (req, res) => {
  res.send("home page");
});

app.get("/search",(req,res) => {
    const term = req.query.term
    res.send(`You searched for: ${term}`);
})


app.use("/api/user",useRoutes)
app.use("/api/product",productRoutes)
app.use("/api",authRoutes)


app.get("/filter",(req,res) => {
    const category = req.query.category
    const price = req.query.price
    res.send(`Category:${category},Price:${price}`)
})

app.get("/about",(req,res) => {
    res.send("About page")
})

app.post("/login",(req,res) => {
    const data = req.body
    res.send(`Login attempt with email:${data.email}`)
})

app.get("/blocked",(req,res) => {
    res.send("middleware does not work!")
})

app.use((req, res) => {
  res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});