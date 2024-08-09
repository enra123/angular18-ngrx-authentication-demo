import { validationResult } from "express-validator";

const validate = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(422).json(err.errors[0].msg);
    }
    next();
};

export default validate;