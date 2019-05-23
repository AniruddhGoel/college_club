const express = require('express');
const route = express.Router();
const ClubList = require('../src/models/collageClub');
const { User } = require('../src/models/user');
const ClubAchievement = require('../src/models/clubAchievement');
const ClubDetails = require('../src/models/clubDetails');
const ClubMedia = require('../src/models/clubMedia');
const Query = require('../src/models/query');
const auth = require('./uitiles/auth');
var multer = require("multer");
const path = require('path');

var storage_logo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/../public/images/club_logo"))
    },
    filename: function (req, file, cb) {
        cb(null, req.session.club_id + "." + file.originalname.split('.')[1])
    }
});

var storage_media = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/../public/images/media"))
    },
    filename: function (req, file, cb) {
        cb(null, req.session.club_id + "_" + Date().toISOString() + "." + file.originalname.split('.')[1])
    }
})

var upload = multer({ storage: storage_logo })
var upload_media = multer({ storage: storage_media })
// faculty get
route.get('/', auth, (req, res) => {
    res.render('admin/index', {role: req.session.status,});
});

route.get('/createadmin', (req,res) => {
  User.create({
    email: "goelaniruddh@gmail.com",
    username: "devil",
    password_hash: "bijnor12",
    userLevel: 1,
    college_id:'1519IT1018',
    year: '4',
    branch: "IT"
  }, () =>{
    res.redirect('/');
  });
});

route.get('/createclub', auth, (req, res) => {
    res.render('admin/faculty/createclub', {role: req.session.status, msg: req.flash('msg')[0], status: req.flash('status')[0] });
});
route.get('/portalaccess', auth, async (req, res) => {
    try {
        let clubList = await ClubList.getClub();
        res.render('admin/faculty/portalaccess', {role: req.session.status, clubList, msg: req.flash('msg')[0], status: req.flash('status')[0] });
    } catch (error) {
        console.error(error);
    }
});

route.get('/clublist', auth, async (req, res) => {
    try {
        let clubList = await ClubList.getClub();
        let clubUserDetails = await ClubList.aggregate([{
            "$lookup": {
                from: "users",
                localField: "club_founder",
                foreignField: "_id",
                as: "clubUserDetails",
            }
        }, {
            "$sort": {
                "created_at": -1
            }
        }
        ]);
        res.render('admin/faculty/clublist', {role: req.session.status, clubUserDetails, msg: req.flash('msg')[0], status: req.flash('status')[0] });
    } catch (error) {
        console.log(error.message);
    }
});
// faculty post

route.post('/createclubs', auth, async (req, res) => {
    try {
        let user = await User.Finduser(req.body.college_id);
        // console.log(user);

        let club = new ClubList({
          club_name: req.body.club_name,
          club_founder: user._id,
          club_moto: req.body.club_moto,
        });
        club.save((err, result) => {
          if (result) {
            req.flash('msg', "New Club Added Successfully");
            req.flash('status', true);
            res.redirect('/admin/createclub');
          }
        });

    } catch (error) {
        req.flash('msg', "Some Error Occurred");
        req.flash('status', false);
        res.redirect('/admin/createclub');
    }
});
route.post('/portalaccess', auth, async (req, res) => {
    try {
        let club_lead_email = req.body.club_lead_email;
        let user = await User.findOneAndUpdate({ email: club_lead_email }, { "$set": { userLevel: 2 } });
        let result = await ClubList.findOneAndUpdate({ _id: req.body.club_name }, { "$push": { admin_access: user._id } });
        if (result) {
            req.flash('msg', "Access Given Successfully");
            req.flash('status', true);
            res.redirect('/admin/portalaccess');
        }
    } catch (error) {
        req.flash('msg', "Some Error Occurred");
        req.flash('status', false);
        res.redirect('/admin/portalaccess');
    }
});

// student get
route.get('/adddetails', auth, async (req, res) => {
    try {
        let club_data = await ClubList.find({ _id: req.session.club_id });
        let club_detail = await ClubDetails.find({ club_id: req.session.club_id });
        if (club_detail.length !== 0) {
            res.render('admin/student/adddetails', {role: req.session.status, club_name: club_data[0].club_name, action: '/admin/adddetails', link: club_data[0].link, club_detail: club_detail, msg: req.flash('msg')[0], status: req.flash('status')[0] });
        } else {
            res.render('admin/student/adddetails', {role: req.session.status, club_name: club_data[0].club_name, action: '/admin/adddetails', link: club_data[0].link, club_detail: undefined, msg: req.flash('msg')[0], status: req.flash('status')[0] });
        }
    } catch (error) {
        console.log(error);
    }
});

route.get('/addachievement', auth, (req, res) => {
    res.render('admin/student/addachievement', {role: req.session.status, msg: req.flash('msg')[0], status: req.flash('status')[0] });
});

route.get('/notification', auth, async (req, res) => {
  try{
    const query =  await Query.find();
    res.render('admin/student/query', { role: req.session.status, query: query, msg: req.flash('msg')[0], status: req.flash('status')[0] });
  } catch (error) {

  }
});

route.get('/addmedia', auth, (req, res) => {
    res.render('admin/student/addmedia', { role: req.session.status, msg: req.flash('msg')[0], status: req.flash('status')[0] });
});

route.get('/updatedetails', auth, async (req, res) => {
    try {
        let club_data = await ClubList.find({ _id: req.session.club_id });
        res.render('admin/student/adddetails', { role: req.session.status, club_name: club_data[0].club_name, link: club_data[0].link, action: '/admin/updatedetails', club_detail: undefined });
    } catch (error) {

    }
});

route.get('/listachievement', auth, async (req, res) => {
    try {
        let achivement_data = await ClubAchievement.find({});
        if (achivement_data.length >= 1) {
            res.render('admin/student/listachievement', { role: req.session.status, achivement_data });
        } else {
            res.render('admin/student/listachievement', { role: req.session.status, achivement_data: undefined });
        }
    } catch (error) {
        res.render('admin/student/listachievement', { role: req.session.status, achivement_data: undefined, msg: "Some Error Occurred" });
    }
});
route.get('/adduser', auth, (req, res) => {
    res.render('admin/student/adduser', { role: req.session.status, msg: req.flash('msg')[0], status: req.flash('status')[0]});
});

// student post
var logo_name = upload.fields([{ name: "logo_name", maxCount: 1 }]);

route.post('/adddetails', auth, logo_name, async (req, res) => {

  try {
    ClubList.findOneAndUpdate({_id: req.session.club_id}, {"$set": {link: req.body.club_web}}, {new: true},
      (err,updates) => {
        req.flash('msg', 'Details Added Successfully');
        req.flash('status', true);
        res.redirect('/admin/adddetails');
      });

    } catch (error) {
        req.flash('msg', 'Some Error Occurred');
        req.flash('status', false);
        res.redirect('/admin/adddetails');
    }
});

route.post('/addachievement', auth, async (req, res) => {
    try {
        let achievementDetail = {
            club_id: req.session.club_id,
            achiv_heading: req.body.achiv_heading,
            event_name: req.body.event_name,
            event_college: req.body.event_college,
            event_year: req.body.event_year,
            position: req.body.position,
        }
        const achievement = ClubAchievement(achievementDetail);
        const result = achievement.save();
        if (result) {
            req.flash('msg', "Achievement Added");
            req.flash('status', true);
            res.redirect('admin/student/addachievement');
        }
    } catch (error) {
        req.flash('msg', "Some Error Occurred");
        req.flash('status', false);
        res.redirect('admin/student/addachievement');
    }
});
var media_name = upload_media.fields([{ name: "media_name", maxCount: 1 }]);
route.post('/addmedia', auth, media_name, async (req, res) => {
    try {
        let media_data = {}
        let media_data_db = await ClubMedia.find({ club_id: req.session.club_id });
        if (media_data_db.length === 1) {
            if (req.body.media_type === "image") {
                media_data.media_name = req.session.club_id + "_" + req.files.media_name[0].originalname;
                let media_arr = [...media_data_db[0].recent_media_images]
                let media_tag_arr = [...media_data_db[0].recent_media_images_tag]
                media_arr.unshift(media_data.media_name);
                media_tag_arr.unshift(req.body.media_tag);
                let result = await ClubMedia.findOneAndUpdate({ club_id: req.session.club_id }, { "$set": { recent_media_images: media_arr, recent_media_images_tag: media_tag_arr } });
                if (result) {
                    req.flash('msg', "Images Added Successfully");
                    req.flash('status', true);
                    res.redirect('/admin/addmedia');
                }
            }
            if (req.body.media_type === "video") {
                media_data.media_url = req.body.media_url;
                let media_arr = [...media_data_db[0].recent_media_video_url]
                let media_tag_arr = [...media_data_db[0].recent_media_video_tag]
                media_arr.unshift(media_data.media_url);
                media_tag_arr.unshift(req.body.media_tag);
                let result = await ClubMedia.findOneAndUpdate({ club_id: req.session.club_id }, { "$set": { recent_media_video_url: media_arr, recent_media_video_tag: media_tag_arr } });
                if (result) {
                    req.flash('msg', "Video URL Added Successfully");
                    req.flash('status', true);
                    res.redirect('/admin/addmedia');
                }
            }
        } else {
            media_data.club_id = req.session.club_id;
            if (req.body.media_type === "image") {
                media_data.recent_media_images = [req.session.club_id + "_" + req.files.media_name[0].originalname]
                media_data.recent_media_images_tag = [req.body.media_tag]
                let media_object = await ClubMedia(media_data);
                let result = media_object.save();
                if (result) {
                    req.flash('msg', "Images Added Successfully");
                    req.flash('status', true);
                    res.redirect('/admin/addmedia');
                }
            }
            if (req.body.media_type === "video") {
                media_data.recent_media_video_url = [req.media_url];
                media_data.recent_media_video_tag = [recent_media_video_tag]
                let media_object = await ClubMedia(media_data);
                let result = media_object.save();
                if (result) {
                    req.flash('msg', "Video URL Added Successfully");
                    req.flash('status', true);
                    res.redirect('/admin/addmedia');
                }
            }
        }
    } catch (error) {
        req.flash('msg', "Some Error Occurred");
        req.flash('status', false);
        res.redirect('/admin/addmedia');
    }
});

route.get('/student/adduser', auth , (req,res) => {
    res.render('admin/student/adduser' , {role: req.session.status});
});

var logo_name = upload.fields([{ name: "logo_name", maxCount: 1 }]);
route.post('/updatedetails', auth, logo_name, async (req, res) => {
    try {
        let club_data = await ClubList.find({ _id: req.session.club_id });
        let club_detail = {
            club_tag_line: req.body.club_tag_line,
            club_domains: req.body.club_domains,
            club_web: req.body.club_web,
            club_desc: req.body.club_desc,
        }
        let result = await ClubDetails.findOneAndUpdate({ club_id: req.session.club_id }, { "$set": { ...club_detail } });
        if (result) {
            req.flash('msg', "Details Updated Successfuly");
            req.flash('status', true);
            res.redirect('admin/student/adddetails');
            // res.render('admin/student/adddetails', { club_name: club_data[0].club_name, action: '/admin/adddetails', clubData: undefined, club_detail: result });
        }
    } catch (error) {
        req.flash('msg', "Some Error Occurred");
        req.flash('status', false);
        res.redirect('admin/student/adddetails');
    }
});

route.post('/addusers', auth, async (req, res) => {
    try {
      ClubList.findOne({club_name: req.body.club_name},
        (err, result) => {
          if (result) {
            if((req.session.status === 1) || (result.club_name === req.body.club_name)){
              const new_user = new User({
                email: req.body.user_email,
                username: req.body.username,
                password_hash: req.body.password_hash,
                userLevel: 3,
                college_id: req.body.college_id,
                year: req.body.year,
                branch: req.body.branch,
                club_name: req.body.club_name
              });
              new_user.save((err, results) => {
                if (!err) {
                  ClubList.findOneAndUpdate({club_name: req.body.club_name}, {"$push": {club_user: results._id}}, {new: true},
                    (err,updates) => {
                      req.flash('msg', 'User Added Successfully');
                      req.flash('status', true);
                      res.redirect('/admin/adduser');
                    });
                }
                else {
                  req.flash('msg', 'Some Error Occurred');
                  req.flash('status', false);
                  res.redirect('/admin/adduser');
                }
              });
            }
            else{
              req.flash('msg', `You don't have access to add member of another club`);
              req.flash('status', false);
              res.redirect('/admin/adduser');
            }
          }
          else{
            req.flash('msg', 'There is no Club of this name');
            req.flash('status', false);
            res.redirect('/admin/adduser');
          }
        });
    } catch (error) {
      req.flash('msg', 'Some Error Occurred');
      req.flash('status', false);
      res.redirect('/admin/adduser');
    }
});

route.get('/clubmembers', auth, async (req,res) => {
  try {
    let user = await User.findOne({_id: req.session.user_id});
    // console.log(user);
    if(user.userLevel === 1){
      let clubList = await ClubList.find()
        .populate('club_user');
      res.render('admin/faculty/members', { role: req.session.status, clubUserDetails: clubList, msg: req.flash('msg')[0], status: req.flash('status')[0] });
    }
    if(user.userLevel === 2) {
      let clubList = await ClubList.find({club_name: user.club_name})
        .populate('club_user');
      res.render('admin/faculty/members', { role: req.session.status, clubUserDetails: clubList, msg: req.flash('msg')[0], status: req.flash('status')[0] });

    }
    // // let user = User.find();
    // let clubList = await ClubList.getClub();
    // // console.log(clubList);
    // res.render('admin/faculty/clublist', { clubUserDetails: clubList, msg: req.flash('msg')[0], status: req.flash('status')[0] });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = route;
