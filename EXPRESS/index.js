const express = require ("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const catRoute = require("./routes/categories");
const multer = require("multer");
const cors = require("cors");
const path = require("path")


dotenv.config(); 
app.use(express.json());
app.use(cors());
app.use("/photos", express.static(path.join(__dirname, "/photos")));

mongoose.connect(process.env.MONGODB,{
    useNewUrlparser: true,
    useUnifiedTopology: true,
    
})
.then(console.log("Mongodb connected"))
.catch((err) => console.log(err));

const storage = multer.diskStorage({
   destination: (req, file, callback) => {
    callback(null, "photos");
   },
   filename: (req, file, callback) =>{
    callback(null, req.body.name);
   }
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});


app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', catRoute);


app.listen(5000, ()=>{
    console.log("Backend is running...")
});