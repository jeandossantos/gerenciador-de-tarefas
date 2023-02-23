import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { BaseError } from './errors/base/baseError.mjs';
import { NotImplementedError } from './errors/notImplementedError.mjs';
import { Util } from './utils/util.mjs';

import { routes } from './routes.mjs';
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof NotImplementedError) {
    console.error(error.message);

    return res
      .status(Util.STATUS_CODES.Internal_Server_Error)
      .send('Internal Server Error');
  }

  if (error instanceof BaseError) {
    return res.status(Util.STATUS_CODES.Bad_Request).json({
      error: error.message,
    });
  }

  console.error(error.message);

  return res
    .status(Util.STATUS_CODES.Internal_Server_Error)
    .send('Internal Server Error');
});

export { app };
