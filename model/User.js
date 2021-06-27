const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email address is required"],
        validate: [
            {
                validator: validator.isEmail,
            },
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    medal: {
        type: Number,
        default: 0,
    },
    townhallName: {
        type: String,
        default: "townhall",
    },
    resources: {
        golds: { type: Number, default: 100, min: 0, max: 1000},
        foods: { type: Number, default: 100, min: 0, max: 1000},
        soldiers: { type: Number, default: 0},
    },
    totalBuildings : {
        townhall: { type: Number, default: 1, min: 0, max: 1},
        markets: { type: Number, default: 0},
        farms: { type: Number, default: 0},
        barracks: { type: Number, default: 0, min: 0, max: 30},
    },
    createdOn : {
        type: Date,
        default: Date.now(),
    }
});

userSchema.pre("save", function(next){
    User.findOne({email : this.email})
    .then((user)=>{
        if(user) next({ name: 'ALREADY_EXIST'});
        else {
            const salt = bcrypt.genSaltSync(10);
            this.password = bcrypt.hashSync(this.password, salt);
            next();
        }
    })
    .catch(next);
});

userSchema.set("toJSON", {
    virtuals: true,
    versionkey: false,
    transform: function(doc, ret){
        delete ret._id;
        delete ret.email;
        delete ret.password;
        delete ret.createdOn;
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;