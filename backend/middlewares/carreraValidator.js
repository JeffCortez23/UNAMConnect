const { body } = require('express-validator');
const validateResult = require('./validationHandler');

const validateCarrera = [
  body('nombre_carrera')
    .exists().withMessage('El nombre de la carrera es obligatorio')
    .trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('facultad')
    .exists().withMessage('La facultad es obligatoria')
    .trim().notEmpty().withMessage('La facultad no puede estar vacía'),
  (req, res, next) => validateResult(req, res, next)
];

module.exports = { validateCarrera };
