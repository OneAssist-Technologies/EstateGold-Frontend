const isDev = process.env.NODE_ENV === "development";

export const {
    NEXT_PUBLIC_API_URL = isDev ? "http://localhost:5000/api" : "https://estategold.in/api",
    NEXT_PUBLIC_SITE_URL = "https://estategold.in",
} = process.env;
