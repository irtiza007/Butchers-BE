import express from 'express';
import isLoggedInUser from '../Middlewares/loggedIn';
import Chat from '../Controllers/Chat';

const chatRouter = express.Router();

chatRouter.get('/', isLoggedInUser.isLoggedIn, Chat.getMessages);

// signInRouter.post('/admin', auth.adminSignin);

export default chatRouter;
