import express from 'express';
import multer from 'multer';
import users from '../Controllers/Users';
import userValidator from '../validations/user';
import isLoggedInUser from '../Middlewares/loggedIn';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now().toString() + file.originalname);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 5 },
	fileFilter: userValidator.fileFilter,
});

const userRouter = express.Router();

userRouter.post(
	'/signup',
	upload.single('imageUrl'),
	userValidator.userSignup,
	users.userSignUp,
);

userRouter.put(
	'/editUser',
	upload.single('imageUrl'),
	isLoggedInUser.isLoggedIn,
	users.editUser,
);

export default userRouter;
