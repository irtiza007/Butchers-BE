import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Model from '../Models/Model';

const createToken = (user, res, next, result) => {
	const { id, email, name, imageUrl } = user;
	const payload = {
		_id: id,
		email,
		name,
		imageUrl,
	};
	// create a token
	jwt.sign(
		payload,
		process.env.JwtSecret,
		{
			expiresIn: '365d',
		},
		(err, token) => {
			// Error Create the Token
			if (err) {
				res.status(500);
				next(new Error('Unable to generate Token.'));
			} else {
				// Token Created
				res.json({
					token,
					userData: result,
				});
			}
		},
	);
};

const userSignIn = (req, res, next) => {
	const { email, password } = req.body;
	// Find user with the passed email
	Model.UserModel.findOne({ email }).then(user => {
		if (user) {
			// if email found compare the password
			bcryptjs.compare(password, user.password).then(result => {
				// if password match create payload
				if (result) {
					createToken(user, res, next, user);
				} else {
					res.status(400);
					next(new Error('Invalid Password'));
				}
			});
		} else {
			// Wrong Password.
			res.status(400);
			next(new Error('Email or Password are incorrect'));
		}
	});
};

const adminSignin = (req, res, next) => {
	const { email, password } = req.body;
	if (email == 'admin@gmail.com' && password == 'qwerty000') {
		const user = {
			id: '5e944eb2b2badf1b984e7284',
			email: 'admin@gmail.com',
			name: 'Admin',
			userType: 'admin',
			imageUrl: 'https://buildnewgovt.s3.amazonaws.com/ryan.jpg',
		};
		createToken(user, res, next, user);
	} else {
		res.status(400);
		next(new Error('Invalid email or Password'));
	}
};

export default { userSignIn, adminSignin };
