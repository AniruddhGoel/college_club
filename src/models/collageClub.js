const mongoose = require('mongoose');
const User = require('../models/user');

const clubSchema = mongoose.Schema({
    club_name: {
        type: String,
        require: true
    },
    club_est: {
        type: Date,
        require: true,
        default: Date.now()
    },
    club_founder: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"User"
    },
    club_moto: {
        type: String,
        require: false,
        default: null
    },
    admin_access:{
        type:Array,
        require:null
    },
    club_user: [
      {
        type : mongoose.Schema.Types.ObjectId , ref : 'User'
      }
      ],
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
    },
    link: {
      type: String
    },
});

clubSchema.statics.getClub = async function() {
    return await this.model('ClubList').find();
};

const ClubList = mongoose.model('ClubList', clubSchema);

module.exports = ClubList;
