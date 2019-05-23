const express = require('express');
const route = express.Router();
const ClubList = require('../src/models/collageClub');
const { User } = require('../src/models/user');
const ClubAchievement = require('../src/models/clubAchievement');
const ClubDetails = require('../src/models/clubDetails')

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
  const branch = ClubList.find({club_name: 'FC KIET'});
    res.render('default/fckiet', {link: branch});
});

route.get('/ecell', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'E-CELL'});
  console.log(branch);
  res.render('default/ecell', {link: branch});
});

route.get('/kommotion', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Kommotion'});
  res.render('default/kommotion', {link: branch});
});

route.get('/phoenix', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Phoenix'});
  res.render('default/pheonix', {link: branch});
});

route.get('/steppers', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Steppers'});
  res.render('default/steppers', {link: branch});
});

route.get('/uddeshhya', async (req,res) => {
const branch = await ClubList.find({ club_name: 'Uddeshhya'});
res.render('default/uddeshya', {link: branch});
});

route.get('/rann', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Rann'});

  res.render('default/rann', {link: branch});
});

route.get('/innogeeks', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Innogeeks'});
  res.render('default/innogeeks', {link: branch});
});

route.get('/innotech', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Innotech'});
  res.render('default/innotech', {link: branch});
});

route.get('/endeavour', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Endeavour'});
  res.render('default/endeavour', {link: branch});
});

route.get('/epoque', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Epoque'});
  res.render('default/epoque', {link: branch});
});

route.get('/prastuti', async (req,res) => {
  const branch = await ClubList.find({ club_name: 'Prastuti'});
  res.render('default/prastuti', {link: branch});
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
