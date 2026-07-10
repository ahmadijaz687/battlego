import jwt from 'jsonwebtoken';
export function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || 'default-secret';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
    }
    catch {
        // Invalid token, continue without user
    }
    next();
}
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || 'default-secret';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
