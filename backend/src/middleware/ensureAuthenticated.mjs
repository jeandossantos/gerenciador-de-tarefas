import jwt from 'jsonwebtoken';
import { Util } from '../../src/utils/util.mjs';

export function ensureAuthenticated(req, res, next) {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) return res.status(Util.STATUS_CODES.Unauthorized).end();

    const [, token] = authToken.split(' ');

    const sub = jwt.verify(token, process.env.SECRET_OR_KEY);

    req.user_id = sub.id;

    return next();
  } catch (error) {
    return res.status(Util.STATUS_CODES.Unauthorized).end();
  }
}
