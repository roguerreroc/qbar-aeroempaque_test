import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aeroempaque_secret_key_12345';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
