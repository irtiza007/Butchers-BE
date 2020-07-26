import express from 'express';
import cors from 'cors';
import status from 'http-status';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import dbConnection from './src/Connection/dbConnect';
import Router from './src/Routes';

import errorHandler from './src/Middlewares/errorHandler';
import verifyToken from './src/Middlewares/verifyToken';

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
// app.use('/event', Router.EventRouter);

// i have implemented it in signup controller like this {next(new Error('Image is required'))}
app.use(errorHandler);
// to available the pics publically
app.use('/public', express.static('public'));

const port = process.env.PORT || 5000;

app.listen(port, () =>
	console.log(`App listening On port http://localhost:${port}`),
);
