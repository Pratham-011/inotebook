const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Prathmaisagood$boy'

//Create a user using: Post "api/auth/createuser". No Login Required
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 5 char').isLength({min: 5}),
], async (req,res)=>{
    let success = false;

    //if there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // check wheter the user with this email exist already
    try{
    let user = await User.findOne({email: req.body.email});
    if (user){
        return res.status(400).json({success,error: "Sorry a user with this email already exist"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass =await  bcrypt.hash(req.body.password,salt);

    user  = await  User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
    
   });
   const data = {
    user:{
        id:user.id
    }
    
   }
   const authtoken = jwt.sign(data,JWT_SECRET);
//    console.log({authtoken});
//    .then(user => res.json(user))
//    .catch(err=> {console.log(err)
//     res.json({error: 'Please enetr a valid email',message: err.message})})

//   res.send({ errors: result.array() });
//     res.send(req.body);
success=true;
    res.json({success,authtoken})
    }catch (error){
        console.log(error.message);
        res.status(500).send("internal serevr error");
    }
})


// Authenticate a user
router.post('/login',[
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req,res)=>{
    let success = false;
    //if there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}= req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({error:"Please enter a coorect credentials"});   
             }        
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success=false;
            return res.status(400).json({success,error:"Please enter a coorect credentials"});   
        }     
        const data = {
            user:{
                id:user.id
            }
            
           }
           const authtoken = jwt.sign(data,JWT_SECRET);
           success=true;
           res.json({success, authtoken})


    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal serevr error");
    }
})

// Route # get logged uder details using post b"/api.auth.getuser".login required
router.post('/getuser', fetchuser,async (req,res)=>{

    try {
    userId = req.user.id;
   const user = await User.findById(userId).select("-password") 
   res.send(user)
} catch (error) {
    console.log(error.message);
    res.status(500).send("internal serevr error");
}
})

module.exports = router