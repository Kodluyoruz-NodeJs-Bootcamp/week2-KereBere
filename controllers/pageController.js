exports.getIndexPage = (req, res) => {
  res.status(200).render('index', {
    pageName: 'Homepage',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    pageName: 'Register',
  });
};
exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    pageName: 'Login',
  });
};
exports.getWellcomePage = (req, res) => {
  res.status(200).render('wellcome', {
    pageName: 'Login',
  });
};
