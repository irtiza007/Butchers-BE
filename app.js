import express from 'express';
import cors from 'cors';
import status from 'http-status';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import http from 'http';
import dbConnection from './src/Connection/dbConnect';
import Router from './src/Routes';
import socketIo from 'socket.io';
import errorHandler from './src/Middlewares/errorHandler';
import verifyToken from './src/Middlewares/verifyToken';
import Home from './src/Controllers/Chat';
dbConnection();

const app = express();

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(
	express.urlencoded({
		extended: false,
	}),
);

// will decode token from each request in {req.user}
app.use(verifyToken.verifyTokenSetUser);

app.use(express.json());

app.get('/', (req, res) => {
	res.status(status.OK).send({ Message: 'Connected', status: status.OK });
});

app.use('/auth', Router.AuthRouter);
app.use('/user', Router.UserRouter);
app.use('/posts', Router.PostsRouter);
// app.use('/chat', Router.ChatRouter);

// i have implemented it in signup controller like this {next(new Error('Image is required'))}
app.use(errorHandler);
// to available the pics publically
app.use('/public', express.static('public'));
// for a socket.io

const port = process.env.PORT || 4001;

const server = http.createServer(app);

const io = socketIo(server);

server.listen(port, () => console.log(`Listening on port ${port}`));
Home(app, io);

// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const port = process.env.PORT || 4001;
// // const index = require('./src/Routes');

// const app = express();
// // app.use(index);

// const server = http.createServer(app);

// const io = socketIo(server);

// let interval;

// io.on('connection', socket => {
// 	console.log('New client connected');
// 	if (interval) {
// 		clearInterval(interval);
// 	}
// 	interval = setInterval(() => getApiAndEmit(socket), 1000);
// 	socket.on('disconnect', () => {
// 		console.log('Client disconnected');
// 		clearInterval(interval);
// 	});
// });

// const getApiAndEmit = socket => {
// 	const response = new Date();
// 	// Emitting a new message. Will be consumed by the client
// 	socket.emit('FromAPI', response);
// };

// server.listen(port, () => console.log(`Listening on port ${port}`));
