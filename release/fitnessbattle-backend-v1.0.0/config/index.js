export const config = {
    port: process.env.PORT || 3001,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fitnessbattle',
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    corsOrigin: process.env.CORS_ORIGIN || '*',
};
