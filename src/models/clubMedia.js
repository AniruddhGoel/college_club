const mongoose = require('mongoose');

const clubMediaSchema = mongoose.Schema({
    club_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'ClubList'
    },
    recent_media_images: {
        type: Array,
        require: true
    }
    ,
    recent_media_video_url: {
        type: Array,
        require: true
    }
    ,
    recent_media_images_tag: {
        type: Array,
        require: true,
        default: null
    },
    recent_media_video_tag: {
        type: Array,
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

const ClubMedia = mongoose.model('ClubMedia', clubMediaSchema);

module.exports = ClubMedia;