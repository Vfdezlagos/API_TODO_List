import * as dotenv from "dotenv/config";

const config = {
    PORT: process.env.PORT,
    DBUrl: process.env.DBUrl,
    LocalUrl: process.env.LocalUrl,
    JWT_Key: process.env.JWT_Key,
    EMAIL: process.env.EMAIL,
    EMAIL_SECRET_PASS: process.env.EMAIL_SECRET_PASS,
    MAILER_HOST: process.env.MAILER_HOST,
    MAILER_PORT: process.env.MAILER_PORT,
    MAILER_SERVICE: process.env.MAILER_SERVICE,
    MAILER_API_KEY: process.env.MAILER_API_KEY
}

export default config;