const express = require('express');
const route = express.Router();
const ClubList = require('../src/models/collageClub');
var { User } = require('../src/models/user');

route.get('/', (req, res) => {
    res.render('common/login', { title: '' });
});
route.post('/check_login/', async (req, res) => {
    try {
        let detail = await User.find({
            'email': req.body.email.trim()
        });
        if (detail[0]) {
          let isMatch = await detail[0].comparePassword(req.body.password);
          if (isMatch) {
            if (detail[0].userLevel === 2) {
              let par = await ClubList.find({
                "admin_access": {
                  "$in": [detail[0]._id]
                }
              });
              if (par.length > 0) {
                req.session.club_id = par[0]._id;
                req.session.user_id = detail[0]._id;
                req.session.status = detail[0].userLevel;
                req.session.validate = true;
                res.redirect('/admin/');
              }
            }
            else {
              if (detail[0].userLevel === 1) {
                req.session.user_id = detail[0]._id;
                req.session.status = detail[0].userLevel;
                req.session.validate = true;
                res.redirect('/admin/');
              }
              else {
                req.flash('msg', 'You are not authorized to access admin portal');
                res.redirect('/common/');
              }
            }
          }
        } else {
            req.flash('msg', 'username or password wrong');
            res.redirect('/common/');
        }
    } catch (e) {
        console.log('Error :- ', e);
    }
});
route.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/common/');
    });
});
module.exports = route;
