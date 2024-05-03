var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Prathmaisagood$boy';

const fetchuser = (req,res,next)=>{
    //get the user from the token and add id to req objects
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "please authenticaate using a valid token"})
    }
    try {
        const data  = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
    } catch (error) {
        res.status(401).send({error: "please authenticaate using a valid token"})
    }
    
}



module.exports = fetchuser;