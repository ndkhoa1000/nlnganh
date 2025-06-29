import { getEnv } from "../utils/get-env";
// WARN: env might not read, so when deployment, need debug for ensure env can be read smoothly.
const appConfig = () => ({
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT:getEnv("PORT","5000"),
    BASE_PATH:getEnv("BASE_PATH", "/api"),
    MONGO_URI: getEnv("MONGO_URI", "mongodb://localhost:27017/express-mongo"),

    SESSION_SECRET: getEnv("SESSION_SECRET", "some_secret_key"),
    SESSION_EXPIRE_IN: getEnv("SESSION_EXPIRE_IN", "1D"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID","some_id"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET","some_secret"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL","http://localhost:8000/api/auth/google/callback"),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL","http://localhost:5173/google/oauth/callback"),
})

export const config = appConfig();