const isDev = process.env.NODE_ENV === "development";

export const {
    NEXT_PUBLIC_API_URL = isDev ? "http://localhost:5000" : "https://estategold.com",
} = process.env;
