import authRouter from './auth.js';

const router = (app) => {
    app.get("/", (req, res) => {
        try {
            res.status(200).json({
                status: "success",
                data: [],
                message: "Welcome to API",
            });
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    }).use('/auth', authRouter);
};

export default router;
