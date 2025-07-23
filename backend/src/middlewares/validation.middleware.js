import {body, validationResult} from 'express-validator';

const validateRegister = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({min: 7}).withMessage("Password needs to be at least 7 characters long"),
    body("username").notEmpty().withMessage("Username can't be empty")
]

const validateAddTransaction = [
    body('amount').isNumeric().withMessage("The amount needs to be numeric"),
    body("type").isIn(['income', 'expense']).withMessage("Type must be either 'income' or 'expense'"),
    body("category").notEmpty().withMessage("Category should not be empty")
]

const validateUpdateTransaction = [
    body('amount').isNumeric().withMessage("The amount needs to be numeric"),
    body("type").isIn(['income', 'expense']).withMessage("Type must be either 'income' or 'expense'")
]

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next();
}

export {
    validateRegister, 
    validateAddTransaction, 
    validateUpdateTransaction, 
    handleValidationErrors
}