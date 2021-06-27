const Market = require("../model/Market");
const User = require("../model/User");

class marketController{
    static details( req, res, next) {
        Market.find({_id: req._id, buildingType: "market"}, "-goldGenerated -buildingType")
        .then((market)=>{
            res.status(200).json({
                msg: "success",
                data: market,
            })
        })
        .catch(next);
    }

    static detailById(req, res, next){
        Market.findOne({_id : req.params._id}, "-buildingType")
        .then((market)=>{
            res.status(200).json({
                success: true,
                data: market,
            })
        })
        .catch(next);
    }

    static create(req, res, next){
        User.findById(req._id)
        .then((user)=>{
            if(user){
                if(user.resources.golds >= 30 && user.resources.foods >= 10){
                    user.resources.golds -= 30;
                    user.resources.foods -= 10;
                    return User.updateOne(
                        {_id: req._id},
                        {resources: user.resources}
                    );
                } else {
                    res.status(401).json({
                        success: false,
                        msg: "resources not enough",
                    })
                }
            } else {
                res.status(401).json({
                    success: false,
                    msg: "user not found",
                })
            }
        })
        .then(()=>{
            const { name } = req.body;
            const market = new Market({
                _id: req._id,
                name,
            });
            return Market.save();
        })
        .then((market)=>{
            res.status(201).json({
                success: true,
                msg: market.name + " has been created."
            })
        })
        .catch(next);
    }

    static update(req, res, next){
        const { name } = req.body;
        Market.findOne({_id: req.params._id})
        .then((market)=>{
            market.name = name;
            return Market.updateOne(
                {_id: market._id},
                { $set: { name: market.name }}
            )
        })
        .catch(next);
    }

    static delete(req, res, next){
        Market.findOne({_id: req.params.id})
        .then((market)=>{
            return market.remove();
        })
        .then(()=>{
            res.status(200).json({data: {deleted: market}});
        })
        .catch(next);
    }

    static collect(req, res, next){
        Market.findOne({_id: req.params.id})
        .then((market)=>{
            User.findById(market._userId)
            .then((user)=>{
                if(user.resources.golds === 1000){
                    return res.status(401).json({
                        msg: 'cannot to collect',
                    })
                } else {
                    user.resources.golds += market.goldGenerated;
                }
                return User.findOneAndUpdate({_id: user._id}, { resources: user.resources})
            })
            .then(()=>{
                market.goldGenerated = 0;
                return Market.updateOne(
                    { _id: market._id },
                    { $set: { goldGenerated: 0 }}
                );
            })
            .catch(next);
        })
        .catch(next);
    }
}
module.exports = marketController;