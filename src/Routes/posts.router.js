import express from 'express';
// import multer from 'multer';
import isLoggedInUser from '../Middlewares/loggedIn';
import posts from '../Controllers/posts';

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'public');
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now().toString() + file.originalname);
// 	},
// });

// const upload = multer({
// 	storage,
// 	limits: { fileSize: 1024 * 1024 * 5 },
// 	fileFilter: userValidator.fileFilter,
// });

const postsRouter = express.Router();

postsRouter.post('/createpost', isLoggedInUser.isLoggedIn, posts.createPost);
postsRouter.post(
	'/addcomment/:postId',
	isLoggedInUser.isLoggedIn,
	posts.addComment,
);
postsRouter.post(
	'/addcommentreply/:commentId',
	isLoggedInUser.isLoggedIn,
	posts.addCommentReply,
);
postsRouter.get(
	'/getsinglepost/:postId',
	isLoggedInUser.isLoggedIn,
	posts.getSinglePost,
);
postsRouter.delete(
	'/deletereplycomment/:commentId',
	isLoggedInUser.isLoggedIn,
	posts.deleteCommentReply,
);

export default postsRouter;
