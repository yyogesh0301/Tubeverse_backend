// import express from "express";
// import { addComment,deleteComment,getComments } from "../controllers/comment.js";
// import { verifyToken } from "../verifyToken.js";

// const router = express.Router();


// router.post("/",verifyToken,addComment)
// router.delete("/:id",verifyToken,deleteComment)
// router.get("/:videoId",verifyToken,getComments)

// export default router;



import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Create a comment for a video (POST request)
router.post("/videos/:videoId/comments", verifyToken, addComment);

// Delete a comment by its ID (DELETE request)
router.delete("/comments/:id", verifyToken, deleteComment);

// Get comments for a specific video (GET request)
router.get("/videos/:videoId/comments", verifyToken, getComments);

export default router;
