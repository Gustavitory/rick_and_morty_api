import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),
  USER_DB: Joi.string().required(),
  PASSWORD_DB: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});
