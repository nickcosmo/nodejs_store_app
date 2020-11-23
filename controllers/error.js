exports.notFound = (req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404.ejs', { docTitle: '404', path: '404', loggedStatus: req.session.loggedStatus });
}

exports.systemIssue = (req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(500).render('500.ejs', { docTitle: '500', path: '500', loggedStatus: req.session.loggedStatus });
}