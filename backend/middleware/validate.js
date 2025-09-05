import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map(e => ({
        param: e.param,
        message: e.msg
      }))
    });
  }
  next();
};

export default validateRequest;
