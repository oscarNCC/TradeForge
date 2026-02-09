import { body, param, query } from 'express-validator';

export const validateCreateTrade = [
    body('account_id').isInt().withMessage('Account ID must be an integer'),
    body('symbol').isString().notEmpty().withMessage('Symbol is required'),
    body('entry_price').isFloat({ gt: 0 }).withMessage('Entry price must be greater than 0'),
    body('entry_time').isISO8601().withMessage('Invalid entry time format'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('direction').isIn(['long', 'short']).withMessage('Direction must be long or short'),
    body('exit_time').optional({ nullable: true }).isISO8601().withMessage('Invalid exit time format')
        .custom((value, { req }) => {
            if (value && new Date(value) <= new Date(req.body.entry_time)) {
                throw new Error('Exit time must be after entry time');
            }
            return true;
        }),
    body('status').optional().isIn(['open', 'closed', 'cancelled']).withMessage('Invalid status'),
    body('legs').optional().isArray().withMessage('Legs must be an array'),
    body('legs.*.leg_type').optional().isIn(['buy_call', 'sell_call', 'buy_put', 'sell_put']).withMessage('Invalid leg type'),
    body('legs.*.strike_price').optional().isFloat({ gt: 0 }).withMessage('Strike price must be greater than 0'),
    body('legs.*.premium').optional().isFloat({ gt: 0 }).withMessage('Premium must be greater than 0'),
    body('legs.*.quantity').optional().isInt({ gt: 0 }).withMessage('Leg quantity must be greater than 0'),
];

export const validateUpdateTrade = [
    param('id').isInt().withMessage('Trade ID must be an integer'),
    body('symbol').optional().notEmpty().withMessage('Symbol cannot be empty'),
    body('entry_price').optional().isFloat({ gt: 0 }).withMessage('Entry price must be greater than 0'),
    body('entry_time').optional().isISO8601().withMessage('Invalid entry time format'),
    body('quantity').optional().isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('direction').optional().isIn(['long', 'short']).withMessage('Direction must be long or short'),
    body('status').optional().isIn(['open', 'closed', 'cancelled']).withMessage('Invalid status'),
];

export const validateGetTrades = [
    query('account_id').isInt().withMessage('Account ID must be an integer'),
    query('status').optional().isIn(['open', 'closed', 'cancelled']).withMessage('Invalid status'),
    query('symbol').optional().isString().withMessage('Symbol must be a string'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const validateCloseTrade = [
    param('id').isInt().withMessage('Trade ID must be an integer'),
    body('exit_price').isFloat({ gt: 0 }).withMessage('Exit price must be greater than 0'),
    body('exit_time').isISO8601().withMessage('Invalid exit time format'),
];
