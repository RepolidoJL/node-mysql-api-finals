import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';
const config = require('./config.json');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// allow cors requests from localhost:4200 with credentials
app.use(cors({ origin: process.env.CORS_ORIGIN || config.cors.origin, credentials: config.cors.credentials }));
// api routes
app.use('/accounts', accountsController);
// swagger docs route
app.use('/api-docs', swaggerDocs);
// global error handler
app.use(errorHandler);
// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
