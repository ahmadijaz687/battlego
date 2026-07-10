import * as authService from '../services/authService.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = (process.env.JWT_SECRET || 'default-secret');
const DEMO_USER = {
    email: 'demo@fitbattle.com',
    password: 'Password123!',
    name: 'Demo User',
};
const signDemoTokens = () => ({
    accessToken: jwt.sign({ id: 'demo-user', email: DEMO_USER.email }, JWT_SECRET, { expiresIn: '7d' }),
    refreshToken: jwt.sign({ id: 'demo-user', email: DEMO_USER.email }, JWT_SECRET, { expiresIn: '30d' }),
});
export const registerHandler = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        // Demo mode: allow demo registration
        if (email === DEMO_USER.email) {
            const tokens = signDemoTokens();
            return res.status(201).json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: { id: 'demo-user', email: DEMO_USER.email, name: DEMO_USER.name },
            });
        }
        const result = await authService.register(email, password, name);
        res.status(201).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        if (message === 'Invalid credentials') {
            return res.status(409).json({ error: 'User already exists' });
        }
        res.status(500).json({ error: message });
    }
};
export const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Demo mode: accept demo credentials
        if (email === DEMO_USER.email && password === DEMO_USER.password) {
            const tokens = signDemoTokens();
            return res.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: { id: 'demo-user', email: DEMO_USER.email, name: DEMO_USER.name },
            });
        }
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        res.status(401).json({ error: message });
    }
};
export const refreshHandler = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }
        const result = await authService.refreshToken(refreshToken);
        res.json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid refresh token';
        res.status(401).json({ error: message });
    }
};
export async function logout(_req, res) {
    res.json({ message: 'Logged out successfully' });
}
