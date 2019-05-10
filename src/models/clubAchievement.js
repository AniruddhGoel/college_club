const mongoose = require('mongoose');

const clubAchievementSchema = mongoose.Schema({
    club_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'ClubList'
    },
    achiv_heading: {
        type: String,
        require: true,
        default: null
    },
    event_name: {
        type: String,
        require: true
    },
    position: {
        type: String,
        require: true
    },
    event_year: {
        type: String,
        require: true,
        default: null
    },
    event_college: {
        type: String,
        require: true,
        default: null
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

const ClubAchievement = mongoose.model('ClubAchievement', clubAchievementSchema);

module.exports = ClubAchievement;