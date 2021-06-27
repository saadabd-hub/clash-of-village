const mongoose = require("mongoose");
const cronJob = require("cron").CronJob;
const User = require("./User");

const marketSchema = new mongoose.Schema({
    _userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    goldGenerated: {
        type: Number,
        min: 0,
        max: 20,
        default: 0,
    },
    buildingType: {
        type: String,
        lowercase: true,
        default: "market",
    },
    createdOn : { type: Date, default: Date.now()}
});

marketSchema.pre("save", function(next){
    Market.findOne({ name: this.name })
    .then((market)=>{
        if(market){
            id = market._userId
            User.findById(id)
            .then(async(user)=>{
                user.resources.golds += 30;
                user.resources.foods += 10;
                await User.updateOne({_id : user._id}, { resources : user.resources });
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
})

marketSchema.post("save", function(next){
    const increaseGold = () => {
        description = `increase by 1 gold/minute`;
        Market.findById({_id : this._id})
        .then((market)=>{
            if(market.goldGenerated >= 20){
                return Market.findOneAndUpdate(
                    { _id: this.id },
                    { $set: { goldGenerated: 20}}
                );
            } else {
                return Market.findOneAndUpdate(
                    { id: this.id },
                    { $inc: { goldGenerated: 1}}
                );
            }
        })
        .catch(next);
    };
    const job = new CronJob(
        "0/60 * * * * *",
        ()=>{
            increaseGold();
        },
        null,
        true,
        "Asia/Jakarta"
    );
    job.start()
})

marketSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret){
        delete ret._id;
        delete ret._userId;
        delete ret.CreatedOn;
    }
})

const Market = mongoose.model("Market", marketSchema);
module.exports = Market;