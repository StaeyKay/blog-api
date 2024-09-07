import { Schema, Types, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const articleSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    category: {type: String, required: true},
    date: {type: String, required: true},
    readTime: {type: String, required: true},
    image: {type: String},
    user: {type: Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

articleSchema.plugin(toJSON)

export const ArticleModel = model('Article', articleSchema)