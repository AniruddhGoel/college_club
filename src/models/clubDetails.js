const mongoose = require('mongoose');

const clubDetailsSchema = mongoose.Schema({
    club_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'ClubList'
    },
    club_des: {
        type: String,
        require: true,
        default: null
    },
    logo_name: {
        type: String,
        require: true,
        default: null
    },
    club_web: {
        type: String,
        require: true,
        default: false
    },
    club_domains: {
        type: Array,
        require: true,
        default: false
    },
    club_tag_line: {
        type: String,
        require: true,
        default: false
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

clubDetailsSchema.methods.getClubsDetails = async () => {
    return await this.model('ClubDetails').aggregate([{
        $lookup: {
            from: 'ClubList',
            localField: 'club_id',
            foreignField: '_id',
            as: 'clubDetails'
        }
    }]);
};

clubDetailsSchema.methods.getClubDetails = async (club_id) => {
    return await this.model('ClubDetails').find({
        club_id:club_id
    });
};

ClubDetails = mongoose.model('ClubDetails',clubDetailsSchema);

module.exports = ClubDetails;