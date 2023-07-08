require ("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET : process.env.JWT_SECRET,
JWT_EXPIRY_TIME : process.env.JWT_EXPIRY_TIME,
}