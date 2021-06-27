const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    const { access_token } = req.headers;
    if(access_token){
        jwt.verify(access_token, "clashofvillage", (err, decoded)=>{
            if(err) next();
            else{
                req._userId = decoded.id;
                next({name : 'INVALID_TOKEN'});
            }
        })
    } else next({name : 'MISSING_TOKEN'});
};
module.exports = authentication;