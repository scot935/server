const Joi = require("joi");

function validateRegisterInput(input) {
  const schema = Joi.object({
    userName: Joi.string().max(50),
    password: Joi.string().max(255).required(),
    email: Joi.string().max(255).required().email(),
  });

  return schema.validate(input);
}

function validateEmail(input) {
  const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
  });

  return schema.validate(input);
}

function validatePassword(input) {
  const schema = Joi.object({
    password: Joi.string().max(255).required(),
  });

  return schema.validate(input);
}

function validateRegisterEmail(input) {
  const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
    OTP: Joi.string().min(4).max(4).required(),
  });

  return schema.validate(input);
}

function validateLoginInput(input) {
  const schema = Joi.object({
    password: Joi.string().max(255).required(),
    email: Joi.string().max(50).required(),
  });

  return schema.validate(input);
}

function validateUserName(input) {
  const schema = Joi.object({
    userName: Joi.string().max(50),
  });

  return schema.validate(input);
}

function validateUserMsg(input) {
  const schema = Joi.object({
    content: Joi.string().max(500).required(),
  });

  return schema.validate(input);
}

module.exports = {
  validateRegisterInput,
  validateRegisterEmail,
  validateLoginInput,
  validateUserName,
  validatePassword,
  validateEmail,
  validateUserMsg,
};
