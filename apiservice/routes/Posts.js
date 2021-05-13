const express = require("express");
const {
  addReply, addPost, getPosts, handleLike,
} = require("../controllers/Posts");

const router = express.Router();

router.route("/")
  .get(getPosts);
router.route("/")
  .post(addPost);

router.route("/reply")
  .post(addReply);

router.route("/like")
  .get(handleLike);

module.exports = router;
