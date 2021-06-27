const Market = require("../model/Market");

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
module.exports = {marketAuthorize};