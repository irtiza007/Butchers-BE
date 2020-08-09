import status from 'http-status';

import ChatSchema from '../Models/chatSchema';

const getMessages = (req, res) => {
	const { _id } = req.user;
	const { id } = req.params;
	console.log({ myId: _id, id });
	ChatSchema.find({ messageBy: _id, messageTo: id })
		.sort({ date: -1 })
		.limit(100)
		.then(chat => {
			res.status(status.OK).send(chat);
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'internal server error',
				err,
			});
		});
};

const socketChat = io => {
	io.of('/').on('connect', async socket => {
		socket.on('typing', async msg => {
			socket.emit('typing', msg);
		});
		// message submit
		try {
			socket.on('sendMessage', async msg => {
				console.log('messeging', msg);
				const { messageBy, messageTo, message } = msg;
				const saveMessage = new ChatSchema({
					messageBy,
					messageTo,
					message,
				});
				saveMessage
					.save()
					.then(result => {
						io.emit('sendMessage', result);
					})
					.catch(err => {
						console.log(err);
					});
			});
		} catch (err) {
			console.log(err.message);
		}
		socket.on('typing', name => {
			io.emit('typing', name);
		});
		socket.on('disconnect', () => {
			console.log('Disconnected');
		});
	});
};

export default {
	getMessages,
	socketChat,
};
