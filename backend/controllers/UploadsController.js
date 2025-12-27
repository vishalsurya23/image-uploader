const { json } = require("express");
const Post = require("../models/uploadModel");
const mongoose = require("mongoose");

// get all posts

const getList = async (req, res) => {
  try {
    const postList = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(postList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create a post

const createPost = async (req, res) => {
  try {
    console.log(req.body);
    // If files were uploaded via multer, they will be in req.files
    let { title, images } = req.body;
    if (req.files && req.files.length > 0) {
      // build public URLs for saved files
      const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      images = req.files.map((f) => `${base}/uploads/${f.filename}`);
    }

    let emptyFields = [];

    if (!title) {
      emptyFields.push("title");
    }
    if (!images || images.length === 0) {
      emptyFields.push("images");
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: `Please enter ${emptyFields}` });
    }
    const newPost = await Post.create({
      title,
      images,
    });
    res.status(200).json(newPost);
  } catch (error) {
    res.json({ message: "An error" });
  }
};

// delete a contact
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No contact with that id");
  }
  const isPost = await Post.findOneAndDelete({ _id: id });
  if (!isPost) {
    return res.status(404).send("No contact with that id");
  }
  res.status(200).json(isPost);
};

module.exports = {
  createPost,
  getList,
  deletePost,
};
