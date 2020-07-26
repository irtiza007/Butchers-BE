import status from 'http-status';

const userSignup = (req, res, next) => {
	const { password, email, name } = req.body;

	if (!name || !email || !password) {
		res.status(status.BAD_REQUEST);
		next(new Error('name, email and password Must be Defined in request body'));
	} else {
		next();
	}
};

const userSignin = (req, res, next) => {
	const { password, email } = req.body;
	if (!email || !password) {
		res.status(status.BAD_REQUEST);
		next(new Error('email, password Must be Defined in request body'));
	} else {
		next();
	}
};
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('Only images with format PNG and JPG/JPEG are allowed'));
	}
};

export default { userSignup, userSignin, fileFilter };
