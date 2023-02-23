import { verify } from 'jsonwebtoken';

export function ensureAuthenticated(req, res, next) {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) return res.status(401).end();

    const [, token] = authToken.split(' ');

    const sub = verify(token, process.env.SECRET_OR_KEY);

    req.user_id = sub.id;

    return next();
  } catch (error) {
    return res.status(401).end();
  }
}
