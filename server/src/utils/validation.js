const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string().min(3).required(),
  });

  return schema.validate(data);
};

const userLoginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const AdminLoginValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    username: Joi.string().min(3).required(),
  });

  return schema.validate(data);
};

const UpdateValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};

module.exports = { registerValidation , userLoginValidation, AdminLoginValidation,UpdateValidation};
