const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;
const User = require("./User");

const barrackSchema = new mongoose.Schema({
  // code
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
  soldierGenerated: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  buildingType: {
    type: String,
    lowercase: true,
    default: "barrack",
  },
  createdOn: {
      type: Date,
      default: Date.now
    },
});

barrackSchema.pre("save", function (next) {
  // code
  Barrack.findOne({ name: this.name })
    .then((barrack) => {
      if (barrack) {
        id = barrack._userId;
        User.findById(id)
          .then((user) => {
            user.resources.golds += 30;
            user.resources.foods += 30;
            return User.findOneAndUpdate({ _id: user._id }, { resources : user.resources });
            // user.save();
          })
          .then((user) => {
            user.save();
          })
          .catch(next);
      } else {
        next();
      }
    })
    .catch(next({ name: "MONGOOSE_ERROR" }));
});

barrackSchema.post("save", function (next) {
  const increaseSoldier = () => {
    description = `increase by 1 soldier/minute`;
    Barrack.findById({ _id: this._id })
      .then((barrack) => {
        console.log(barrack);
        if (barrack.soldierGenerated >= 10) {
          return Barrack.findOneAndUpdate(
            { _id: this._id },
            { $set: { soldierGenerated: 10 } }
          );
        } else
          return Barrack.findOneAndUpdate(
            { _id: this.id },
            { $inc: { soldierGenerated: 1 } }
          );
      })
      .catch(next);
  };

  const job = new CronJob(
    "0/60 * * * * *",
    () => {
      increaseSoldier();
    },
    null,
    true,
    "Asia/Jakarta"
  );
  job.start();
});

barrackSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret._userId;
    delete ret.createdOn;
  },
});

const Barrack = mongoose.model("Barrack", barrackSchema);

module.exports = Barrack;
