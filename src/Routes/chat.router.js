import express from 'express';
import isLoggedInUser from '../Middlewares/loggedIn';
import Chat from '../Controllers/Chat';

const chatRouter = express.Router();

chatRouter.get('/:id', isLoggedInUser.isLoggedIn, Chat.getMessages);

//const Home = (app, io) => {
// 	app.get('/chat', async (req, res) => {
// 		ChatSchema.find()
// 			.sort({ date: -1 })
// 			.limit(100)
// 			.then(chat => {
// 				res.status(status.OK).send(chat);
// 			})
// 			.catch(err => {
// 				res.status(status.INTERNAL_SERVER_ERROR).send({
// 					Message: 'internal server error',
// 					err,
// 				});
// 			});
// 	});

// 	io.of('/').on('connect', async socket => {
// 		socket.on('typing', async msg => {
// 			socket.emit('typing', msg);
// 		});
// 		// message submit
// 		try {
// 			socket.on('msg', async msg => {
// 				console.log('messeging', msg);
// 				// when the req come save then
// 				const chats = ChatSchema.find()
// 					.sort({ date: -1 })
// 					.limit(4);
// 				io.emit('msg', msg);
// 			});
// 		} catch (err) {
// 			console.log(err.message);
// 		}
// 		socket.on('typing', name => {
// 			io.emit('typing', name);
// 		});
// 		socket.on('disconnect', () => {
// 			console.log('Disconnected');
// 		});
// 	});
// };

// export default Home;

export default chatRouter;
