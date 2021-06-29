const Farm = require("../model/Farm");
const User = require("../model/User");

class farmController{
    static details( req, res, next) {
        Farm.find({_id: req._id, buildingType: "farm"}, "-goldGenerated -buildingType")
        .then((farm)=>{
            res.status(200).json({
                msg: "success",
                data: farm,
            })
        })
        .catch(next);
    }

    static detailById(req, res, next){
        Farm.findOne({_id : req.params._id}, "-buildingType")
        .then((farm)=>{
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
                if(user.resources.golds >= 10 && user.resources.foods >= 30){
                    user.resources.golds -= 10;
                    user.resources.foods -= 30;
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
            const market = new Farm({
                _id: req._id,
                name,
            });
            return Farm.save();
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
        Farm.findOne({_id: req.params._id})
        .then((farm)=>{
            farm.name = name;
            return Farm.updateOne(
                {_id: farm._id},
                { $set: { name: farm.name }}
            )
        })
        .catch(next);
    }

    static delete(req, res, next){
        Farm.findOne({_id: req.params._id})
        .then((farm)=>{
            return farm.remove();
        })
        .then(()=>{
            res.status(200).json({data: {deleted: farm}});
        })
        .catch(next);
    }

    static collect(req, res, next){
        Farm.findOne({_id: req.params.id})
        .then((farm)=>{
            User.findById(farm._userId)
            .then((user)=>{
                if(user.resources.foods === 1000){
                    return res.status(401).json({
                        msg: 'cannot to collect',
                    })
                } else {
                    user.resources.foods += farm.foodGenerated;
                }
                return User.findOneAndUpdate({_id: user._id}, { resources: user.resources})
            })
            .then(()=>{
                farm.goldGenerated = 0;
                return Farm.updateOne(
                    { _id: farm._id },
                    { $set: { goldGenerated: 0 }}
                );
            })
            .catch(next);
        })
        .catch(next);
    }
}
module.exports = farmController;