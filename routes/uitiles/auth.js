const auth = (req,res,next)=>{
    if (req.session.validate === true){
        next();
    }else{
        res.redirect('/common/');
    }
}

module.exports = auth;