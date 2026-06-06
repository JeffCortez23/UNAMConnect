const { body } = require('express-validator');
const validateResult = require('./validationHandler');

const validateRegister = [
  body('id_carrera')
    .exists().withMessage('El ID de carrera es obligatorio')
    .isInt().withMessage('El ID de carrera debe ser un número entero'),
  body('codigo_univ')
    .exists().withMessage('El código universitario es obligatorio')
    .isLength({ min: 5 }).withMessage('El código universitario es demasiado corto'),
  body('nombres')
    .exists().withMessage('El nombre es obligatorio')
    .trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('apellidos')
    .exists().withMessage('El apellido es obligatorio')
    .trim().notEmpty().withMessage('El apellido no puede estar vacío'),
  body('correo')
    .exists().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .exists().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => validateResult(req, res, next)
];

const validateLogin = [
  body('correo')
    .exists().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido'),
  body('password')
    .exists().withMessage('La contraseña es obligatoria'),
  (req, res, next) => validateResult(req, res, next)
];

module.exports = { validateRegister, validateLogin };
