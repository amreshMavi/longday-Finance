import rateLimiter from "express-rate-limit";

const authLimiter = rateLimiter(
    {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 50, // Limit each IP to 50 requests per windowMs
        message: "Request limit exceeded from this IP, please try again after 15 minutes",
        standardHeaders: true, //Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false // Disable the `X-RateLimit-*` headers
    }
)

export { authLimiter }