const { validationResult } = require('express-validator');

/**
 * Middleware para capturar errores de validación de express-validator
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Error de validación',
      details: errors.array() 
    });
  }
  next();
};

module.exports = validateResult;
