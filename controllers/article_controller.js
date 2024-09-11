import { ArticleModel } from "../models/article_model.js";
import { UserModel } from "../models/user_model.js";
import { articleValidator } from "../validators/user_validator.js";

export const addArticle = async (req, res) => {
  try {
    // Validate the request body

    const { value, error } = articleValidator.validate({
      ...req.body,
      image: req.file ? req.file.filename : null,
    });
    console.log("request body, value and error:", req.body, value, error);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    // Get the user id
    const userId = req?.user?.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const article = await ArticleModel.create({
      ...value,
      user: userId,
    });

    return res.status(201).json({
      message: "An article has been added successfully",
      article,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Endpoint to get all articles
export const getArticles = async (req, res) => {
  try {
    // Get query parameters
    const { filter, fields, limit, skip } = req.query;

    // Safely parse filter and fields only if they are provided
    const filterQuery = filter ? JSON.parse(filter) : {}; // Default to an empty object if no filter is provided
    const selectFields = fields ? JSON.parse(fields) : {}; // Default to an empty object if no fields are provided

    // Get all articles from the database
    const articles = await ArticleModel.find(filterQuery)
      .select(selectFields)
      .limit(limit)
      .skip(skip);

    res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Endpoint to update an article
export const updateArticle = async (req, res) => {
  try {
    // Validate the request
    const { error, value } = articleValidator.validate({
      ...req.body,
      image: req.file ? req.file.filename : null,
    });
    if (error) {
      return res.status(401).json(error.details[0].message);
    }

    const userId = req?.user?.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json("User not found");
    }

    const article = await ArticleModel.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });

    if (!article) {
      return res.status(400).json("Article not found");
    }

    res.status(200).json({
      message: "Article has been updated successfully",
      article,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Endpoint to delete an article
export const deleteArticle = async (req, res) => {
  try {
    // Verify user is logged in
    const userId = req?.user?.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json("User not found");
    }

    const article = await ArticleModel.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(400).json("Article not found");
    }

    res.status(200).json("Article deleted successfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
