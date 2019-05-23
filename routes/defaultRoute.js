const express = require('express');
const route = express.Router();
const ClubList = require('../src/models/collageClub');
const { User } = require('../src/models/user');
const ClubAchievement = require('../src/models/clubAchievement');
const ClubDetails = require('../src/models/clubDetails');
const ClubMedia = require('../src/models/clubMedia');
const UserQuery = require('../src/models/query');

route.get('/', async (req, res) => {
    try {
        let club_data = await ClubList.aggregate([{
            "$lookup": {
                from: "clubdetails",
                localField: "_id",
                foreignField: "club_id",
                as: "clubDetails",
            }
        }, {
            "$sort": {
                "created_at": -1
            }
        }
        ]);
        if (club_data.length !== 0) {
            res.render('default/index', { club_data });
        } else {
            res.render('default/index', { club_data:undefined });
        }
    } catch (error) {
        console.log(error);
    }
});

route.get('/fckietclub', (req,res) => {
    res.render('default/fckiet');
});

route.get('/kommotion', (req,res) => {
    res.render('default/kommotion');
});

route.get('/phoenix', (req,res) => {
    res.render('default/pheonix');
});

route.get('/steppers', (req,res) => {
    res.render('default/steppers');
});

route.get('/ecell', (req,res) => {
    res.render('default/ecell');
});

route.get('/uddeshhya', (req,res) => {
    res.render('default/uddeshya');
});

route.get('/rann', (req,res) => {
    res.render('default/rann');
});

route.get('/innogeeks', (req,res) => {
    res.render('default/innogeeks');
});

route.get('/innotech', (req,res) => {
    res.render('default/innotech');
});

route.get('/endeavour', (req,res) => {
    res.render('default/endeavour');
});

route.get('/epoque', (req,res) => {
    res.render('default/epoque');
});

route.get('/prastuti', (req,res) => {
    res.render('default/prastuti');
});

// route.get('/club/:club_name', async (req, res) => {
//     try {
//         let club_name = req.params.club_name;
//         let club_name_str = club_name.split('_').join(' ');
//         let club_id = await ClubList.find({ club_name: club_name_str});
//         let club_data =await ClubDetails.find({club_id:club_id[0]._id});
//         let club_media_data =await ClubMedia.find({club_id:club_id[0]._id});
//         // res.json(
//         //     {
//         //         club_data,
//         //         club_id,
//         // club_media_data
//         //     }
//         // );
//         if (club_data.length !== 0) {
//             res.render('default/about', { club_data, club_id, club_media_data });
//         } else {
//             res.send(404);
//         }
//         // res.render('default/about');
//     } catch (error) {
//         console.error(error);
//     }
// });

route.get('/contact', async (req, res) => {
    res.render('default/contact');
});

route.post('/message', async (req, res) => {
  const query = req.body;
  const queries = new UserQuery(query);
  queries.save((err,result) => {
    if(!err) {
      req.flash('msg', "Query added successfully");
      req.flash('status', true);
      res.redirect('/contact');
    }
    else{
      req.flash('msg', "Some error Occurred");
      req.flash('status', false);
      res.redirect('/contact');
    }
  })
});

route.get('/signup', (req,res) => {
    res.render('common/signup');
});
module.exports = route;
