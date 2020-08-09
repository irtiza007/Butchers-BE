import bcryptjs from 'bcryptjs';
import status from 'http-status';
import Model from '../Models/Model';
import helper from '../Helpers';
import httpStatus from 'http-status';

const userSignUp = (req, res, next) => {
	const { name, password, email } = req.body;
	const query = { email };
	Model.UserModel.findOne(query).then(user => {
		if (user) {
			if (user.email == email) {
				res.status(400);
				next(new Error('Email Already Taken.'));
			}
		} else {
			bcryptjs.hash(password, 12).then(hashedpassword => {
				const User = new Model.UserModel({
					name,
					password: hashedpassword,
					email,
					imageUrl: req.file ? req.file.path : '',
					userType: 'user',
				});
				// console.log(User);
				User.save()
					.then(SavedUser => {
						return res.status(200).send({
							Message: 'Account Created Successfully.',
							SavedUser,
						});
					})
					.catch(err => {
						res.status(500);
						next(new Error(`Unable to Create User. Please Try later. ${err}`));
					});
			});
		}
	});
};

// 	///////////// for update user ///////////////

const updateUser = (req, res) => {
	const { _id } = req.user;
	const query = { ...req.body };
	query.imageUrl = req.file.path;

	Model.UserModel.findByIdAndUpdate(
		_id,
		query,
		{ new: true },
		(err, result) => {
			if (err) {
				res.status(status.INTERNAL_SERVER_ERROR).send({
					Message: 'Unable to Update.',
				});
			} else {
				res.status(status.OK).send({
					Message: 'Successfully Updated.',
					result,
				});
			}
		},
	);
};

const editUser = (req, res) => {
	if (req.file) {
		Model.UserModel.findById(req.user._id).then(result => {
			helper.deleteImage(result.imageUrl, res, deleted => {
				if (deleted === true) {
					updateUser(req, res);
				}
			});
		});
	} else updateUser(req, res);
};

const getAllUser = (req, res) => {
	Model.UserModel.find({}, 'imageUrl name email _id')
		.then(result => {
			res.status(httpStatus.OK).send({
				message: 'users loaded successfully',
				users: result,
			});
		})
		.catch(err => {
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
				message: 'Internal server Error',
				err,
			});
		});
};

export default {
	userSignUp,
	editUser,
	getAllUser,
};
