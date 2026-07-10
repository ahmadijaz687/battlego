export function validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    // Sanitize input
    req.body.email = email.toLowerCase().trim();
    req.body.password = password.trim();
    next();
}
export function validateRegister(req, res, next) {
    const { email, password, name } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }
    // Sanitize input
    req.body.email = email.toLowerCase().trim();
    req.body.name = name.trim();
    next();
}
export function sanitizeInput(req, _res, next) {
    // Recursively sanitize all string values in req.body
    if (req.body && typeof req.body === 'object') {
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
    }
    next();
}
