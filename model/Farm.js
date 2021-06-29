const mongoose = require('mongoose');
const cronjob = require('cron').CronJob;
const User = require("./User");

const farmSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    foodGenerated: {
        type: Number,
        min: 0,
        max: 20,
        default: 0,
    },
    buldingType: {
        type: String,
        lowercase: true,
        default: "farm",
    },
    createdOn : {
        type: Date,
        default: Date.now(),
    }
});

farmSchema.pre("save", function(next){
    Farm.findOne({ name: this.name})
    .then((farm)=>{
        if(farm){
            id = farm._userId;
            User.findById(id)
            .then(async(user)=>{
                user.resources.golds += 10;
                user.resources.foods += 30;
                return User.updateOne({_id : user._id}, { resources : user.resources});
            })
            .then(()=>{
                user.save();
            })
            .catch(next);
        } else {
            next();
        }
    })
    .catch(next({ name: 'MONGOOSE_ERROR'}));
});

farmSchema.post("save", function(next){
    const increaseFood = () => {
        description = `increase by 1 food/minute`;
        Farm.findById({_id : this._id})
        .then((farm)=>{
            if(farm.foodGenerated >= 20){
                return Farm.findOneAndUpdate(
                    {_id : this._id},
                    {$set : { foodGenerated: 20}}
                )
            } else {
                return Farm.findOneAndUpdate(
                    {_id : this._id},
                    {$inc : { foodGenerated: 1}}
                )
            }
        })
        .catch(next);
    }
    const job = new CornJob(
        "0/60 * * * * *",
        ()=>{
            increaseFood();
        },
        null,
        true,
        "Asia/Jakarta"
    );
    job.start();
})

farmSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret){
        delete ret._id;
        delete ret._userId;
        delete ret.CreatedOn;
    }
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;