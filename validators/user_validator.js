import Joi from "joi";

export const userValidator = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
})

export const loginValidator = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

export const createUserValidator = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().required().valid('admin', 'manager', 'user')
})

export const updateUserValidator = Joi.object({
    name: Joi.string(),
    role: Joi.string().valid('admin', 'manager'),
});

export const articleValidator = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    category: Joi.string().required(),
    date: Joi.string().required(),
    readTime: Joi.string().required(),
    image: Joi.string()
})