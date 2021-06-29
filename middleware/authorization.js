const Market = require("../model/Market");
const Farm = require("../model/Farm");
const Barrack  = require("../model/Barrack");

const marketAuthorize = (req, res, next) => {
    Market.findOne({_id: req.params.id})
    .then((market)=>{
        if(market){
            if(market._userId.toString() === req._id){
                next()
            } else {
                return res.status(401).json({
                    msg: "forbidden",
                })
            }
        } else {
            return res.status(401).json({
                msg: "not found",
            })
        }
    })
    .catch(next);
}
const farmAuthorize = (req, res, next) => {
    Farm.findOne({_id: req.params.id})
    .then((farm)=>{
        if(farm){
            if(farm._userId.toString() === req._id){
                next()
            } else {
                return res.status(401).json({
                    msg: "forbidden",
                })
            }
        } else {
            return res.status(401).json({
                msg: "not found",
            })
        }
    })
    .catch(next);
}
const barrackAuthorize = (req, res, next) => {
    Barrack.findOne({_id: req.params.id})
    .then((barrack)=>{
        if(barrack){
            if(barrack._userId.toString() === req._id){
                next()
            } else {
                return res.status(401).json({
                    msg: "forbidden",
                })
            }
        } else {
            return res.status(401).json({
                msg: "not found",
            })
        }
    })
    .catch(next);
}
module.exports = {marketAuthorize, farmAuthorize, barrackAuthorize};