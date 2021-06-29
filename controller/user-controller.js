const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

class userController {
    static register(req, res, next){
        const { username, email, password } = req.body;
        const user = new User({
            username,
            email,
            password
        });
        user.save()
        .then((result) => {
            res.status(201).json({
                msg: "success! " + result.username + "(" + result.email + ")" + " has been created.",
                data: {
                    userId: result.id,
                    username: result.username,
                    email: result.email,
                    createdOn : result.createdOn
                }
            });
        })
        .catch(next)
    }
    static login(req, res, next){
        const { email, password } = req.body;
        User.findOne({email})
        .then((user)=>{
            if( user && bcrypt.compareSync(password, user.password)){
                const access_token = jwt.sign({ _id: user._id}, "clashofvillage");
                res.status(200).json({
                    msg: "login success",
                    token: access_token,
                    resources: user.resources
                })
            } else throw { name: 'LOGIN_FAILED'};
        })
        .catch(next);
    }
    static details(req, res, next){
        const { _id } = req.params;
        User.find(_id)
        .then((detail)=>{
            res.status(200).json({
                msg : "success",
                data : detail
            })
        })
        .catch(next)
    }

    static rename(req, res, next){
        const { name } = req.body;
        User.findOne({_id : req.params._id})
        .then((townhall)=>{
            townhall.name = name;
            return User.updateOn({$set: {name : townhall.name}})
        })
        .catch(next);
    }
}
module.exports = userController;