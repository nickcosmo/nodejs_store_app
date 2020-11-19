module.exports = (req, res, next) => {
    if(!req.session.loggedStatus) {
        return res.redirect('/admin/login');
    }
    next();
}