import httpStatus from 'http-status';
import Model from '../Models/Model';

const createPost = (req, res) => {
	const { _id } = req.user;
	const { message, name } = req.body;
	const posts = Model.PostModel({
		message,
		name,
		postBy: _id,
	});
	posts
		.save()
		.then(post => {
			res.status(200).send(post);
		})
		.catch(err => {
			res.status(500).send({ err });
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

const addComment = (req, res) => {
	const { postId } = req.params;
	const { message } = req.body;
	const { _id } = req.user;
	console.log({ postId, message, _id });
	const comment = Model.CommentModel({
		message,
		postBy: _id,
		postId,
	});
	comment
		.save()
		.then(result => {
			res.status(200).send(result);
		})
		.catch(err => {
			res.status(500).send({ err });
		});
};

const addCommentReply = (req, res) => {
	const { commentId } = req.params;
	const { message } = req.body;
	const { _id } = req.user;
	console.log(commentId, message, _id);
	Model.CommentModel.findOneAndUpdate(
		{ _id: commentId },
		{ $push: { replies: { message, userId: _id } } },
		{ upsert: true, new: true },

		(err, doc) => {
			if (err) {
				res
					.status(500)
					.send({ Message: 'Internal Server error. Cannot add reply' });
			} else {
				Model.CommentModel.findOne({ _id: commentId })
					.populate('replies.userId', 'name imageUrl')
					.then(cmnt => {
						if (cmnt) {
							res.status(httpStatus.OK).send({
								savedReply: cmnt.replies[cmnt.replies.length - 1],
								Message: 'Replied Successfully',
								type: httpStatus.Ok,
								doc,
							});
						}
					})
					.catch(error => {
						res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
							Message: 'Can not send saved reply ',
							error,
						});
					});
			}
		},
	);
};

const deletePost = (req, res) => {
	const { id } = req.params;
	console.log(id);
	Model.CommentModel.remove({ postId: { $in: id } })
		.then(comments => {
			Model.PostModel.findByIdAndRemove(id, (err, post) => {
				if (post) {
					res.status(httpStatus.OK).send({
						Message: 'Post Deleted Successfully.',
						post,
						comments,
					});
				} else {
					res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
						Message: 'Unable to Delete.',
						err,
					});
				}
			});
		})
		.catch(err => {
			res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.send({ error: err, message: 'Internal server error' });
		});
};
const deleteComment = (req, res) => {
	const { id } = req.params;
	Model.CommentModel.findByIdAndRemove(id)
		.then(result => {
			res.status(httpStatus.OK).send({
				Message: 'Comment Deleted Successfully.',
				comment: result,
			});
		})
		.catch(err => {
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Delete.',
				err,
			});
		});
};

const deleteCommentReply = (req, res) => {
	// const { commentId, replyId } = req.body;
	const { commentId } = req.params;
	const { replyId } = req.body;
	Model.CommentModel.updateOne(
		{ _id: commentId },
		{ $pull: { replies: { _id: replyId } } },
		{ multi: true },
		err => {
			if (err) {
				res
					.status(500)
					.send({ Message: 'Internal Server error. Cannot add reply' });
			} else {
				res.status(200).send({
					Message: 'Reply deleted Successfully',
				});
			}
		},
	);
};

const getSinglePost = (req, res) => {
	const { _id } = req.user;
	const { postId } = req.params;

	Model.PostModel.find({ postBy: _id, _id: postId })
		.populate('postBy', 'name _id imageUrl email')
		.then(posts => {
			Model.CommentModel.find({ postBy: _id })
				.populate('postBy', 'name _id imageUrl email')
				.populate('replies.userId', 'name _id imageUrl email')
				.then(comments => {
					const resObj = {
						_id: posts[0]._id,
						message: posts[0].message,
						name: posts[0].name,
						postBy: posts[0].postBy,
						updatedAt: posts[0].updatedAt,
						comments,
					};
					res.status(httpStatus.OK).send(resObj);
				})
				.catch(err => {
					res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
						Message: 'Post may not exists Internal Server Error',
						err,
					});
				});
		})
		.catch(err => {
			res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.send({ Message: 'Internal Server Error', err });
		});
};

export default {
	createPost,
	getPosts,
	addComment,
	getSinglePost,
	addCommentReply,
	deleteCommentReply,
	deletePost,
	deleteComment,
};
