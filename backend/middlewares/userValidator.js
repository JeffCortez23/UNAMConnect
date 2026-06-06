const { body, param } = require('express-validator');
const validateResult = require('./validationHandler');

const validateUserUpdate = [
  param('id').isInt().withMessage('El ID de usuario debe ser un número entero'),
  body('correo')
    .optional()
    .isEmail().withMessage('Debe ser un correo electrónico válido'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => validateResult(req, res, next)
];

const validateUserCreate = [
  body('id_carrera').isInt().withMessage('El ID de carrera debe ser un número entero'),
  body('correo').isEmail().withMessage('Debe ser un correo electrónico válido'),
  body('nombres').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => validateResult(req, res, next)
];

module.exports = { validateUserUpdate, validateUserCreate };
