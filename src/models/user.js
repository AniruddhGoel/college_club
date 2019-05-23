const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password_hash: {
        type: String,
        require: true
    },
    password_reset_token: {
        type: String,
        require: false,
        default: null
    },
    userLevel: {
        type: Number,
        require: true,
        default: 0
    },
    userType: {
        type: String,
        require: true,
        default: "student"
    },
    college_id: {
        type: String,
        default: null
    },
    college: {
        type: String,
        require: true,
        default: "KIET"
    },
    year: {
        type: Number,
        min: 1,
        max: 4,
        required: true
    },
    branch: {
        type: String,
        require: true
    },
    session_time: {
        type: Number,
        require: true,
        default: 0
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: false,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: null
    }
});

userSchema.statics.Finduser = async function(data) {
    // console.log(data);
    return await this.model('User').findOne({
        "$or": [
            {
                email: data
            }, {
                college_id: data
            }
        ]
    });
};

userSchema.pre('save', function (next) {
    var user = this;
    var SALT_WORK_FACTOR = 10;
    if (!user.isModified('password_hash')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password_hash, salt, function (err, hash) {
            if (err) return next(err);
            user.password_hash = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log(candidatePassword);
    var isMatch = await bcrypt.compare(candidatePassword, this.password_hash);
    return isMatch;
};

var User = mongoose.model('User', userSchema);

module.exports = { User };
