const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req,res) =>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hiddenPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hiddenPassword,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});
//LOGIN
router.post("/login", async (req,res) => {
     try {
        // FIND USER
        const user = await User.findOne({username:req.body.username});
        !user && res.status(400).json("Wrong inputs");

        // COMPARE PASSWORD
        const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json("Wrong inputs");

       // HIDING PASSWORD
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        
    }
})

module.exports = router;