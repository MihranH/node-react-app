const jwt = require('jsonwebtoken');
const Logger = require('../services/Logger');

module.exports = async function (req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const result = jwt.verify(token, process.env.SECRET_TOKEN);
    if (!req.session) {
      req.session = {};
    }
    req.session.userEmail = result.email;
    return next();
  } catch (error) {
    Logger.error(error);
    return res.status(401).send({ message: 'Unauthorized' });
  }
};
