import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'User account is deactivated.' });

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export default auth;
