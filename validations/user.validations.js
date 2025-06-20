import { object, string } from "joi";

function validateRegisterInput(input) {
  const schema = object({
    userName: string().max(50),
    password: string().max(255).required(),
    email: string().max(255).required().email(),
  });

  return schema.validate(input);
}

function validateEmail(input) {
  const schema = object({
    email: string().max(255).required().email(),
  });

  return schema.validate(input);
}

function validatePassword(input) {
  const schema = object({
    password: string().max(255).required(),
  });

  return schema.validate(input);
}

function validateRegisterEmail(input) {
  const schema = object({
    email: string().max(255).required().email(),
    OTP: string().min(4).max(4).required(),
  });

  return schema.validate(input);
}

function validateLoginInput(input) {
  const schema = object({
    password: string().max(255).required(),
    email: string().max(50).required(),
  });

  return schema.validate(input);
}

function validateUserName(input) {
  const schema = object({
    userName: string().max(50),
  });

  return schema.validate(input);
}

function validateUserMsg(input) {
  const schema = object({
    content: string().max(500).required(),
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
