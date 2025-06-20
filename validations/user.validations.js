import joi from "joi";

function validateRegisterInput(input) {
  const schema = joi.object({
    userName: joi.string().max(50),
    password: joi.string().max(255).required(),
    email: joi.string().max(255).required().email(),
  });

  return schema.validate(input);
}

function validateEmail(input) {
  const schema = joi.object({
    email: joi.string().max(255).required().email(),
  });

  return schema.validate(input);
}

function validatePassword(input) {
  const schema = joi.object({
    password: joi.string().max(255).required(),
  });

  return schema.validate(input);
}

function validateRegisterEmail(input) {
  const schema = joi.object({
    email: joi.string().max(255).required().email(),
    OTP: joi.string().min(4).max(4).required(),
  });

  return schema.validate(input);
}

function validateLoginInput(input) {
  const schema = joi.object({
    password: joi.string().max(255).required(),
    email: joi.string().max(50).required(),
  });

  return schema.validate(input);
}

function validateUserName(input) {
  const schema = joi.object({
    userName: joi.string().max(50),
  });

  return schema.validate(input);
}

function validateUserMsg(input) {
  const schema = joi.object({
    content: joi.string().max(500).required(),
  });

  return schema.validate(input);
}

export {
  validateRegisterInput,
  validateRegisterEmail,
  validateLoginInput,
  validateUserName,
  validatePassword,
  validateEmail,
  validateUserMsg,
};
