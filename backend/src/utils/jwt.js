import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'learnfree_super_secret_jwt_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'student',
      full_name: user.full_name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
