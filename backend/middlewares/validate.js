const { body } = require('express-validator');
const {
  PASSWORD_MIN,
  PASSWORD_MAX,
  NAME_MIN,
  NAME_MAX,
} = require('../constants.json');

const registerValidation = [
  body('firstName')
    .isString()
    .isLength({ min: NAME_MIN, max: NAME_MAX })
    .withMessage(
      `First name minimum length should be ${NAME_MIN} and max should be ${NAME_MAX}`,
    ),
  body('lastName')
    .isString()
    .isLength({ min: NAME_MIN, max: NAME_MAX })
    .withMessage(
      `Last name minimum length should be ${NAME_MIN} and max should be ${NAME_MAX}`,
    ),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password')
    .isString()
    .isLength({ min: PASSWORD_MIN, max: PASSWORD_MAX })
    .withMessage(
      `Password minimum length should be ${PASSWORD_MIN} and max should be ${PASSWORD_MAX}`,
    ),
];

const loginValidation = [
  body('email').exists({ checkFalsy: true }).withMessage('Email is required'),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
};
