// import httpStatus from 'http-status';
import Model from '../Models';

const createPost = (req, res) => {
	const { message, name, postBy } = req.body;
	const posts = Model.postSchema({
		message,
		name,
		postBy,
	});
	posts
		.save()
		.then(post => {
			res.json({ post });
		})
		.catch(err => {
			res.json({ err });
		});
};

const getPosts = (_, res) => {
	Model.postSchema
		.find()
		.populate('postBy')
		.then(posts => {
			res.json(posts);
		})
		.catch(err => {
			res.json({ Message: 'Internal Server Error', err });
		});
};

const getPostsById = (req, res) => {
	const { id } = req.params;

	Model.postSchema
		.find({ postBy: id })
		.populate('postBy', 'firstname')
		.then(posts => {
			res.json(posts);
		})
		.catch(err => {
			res.json({ Message: 'Internal Server Error', err });
		});
};

export default {
	createPost,
	getPosts,
	getPostsById,
};
