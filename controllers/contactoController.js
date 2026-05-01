/**
 * Controlador de Contactos
 * Maneja rutas y request/response, delega lógica a contactoService
 */

const contactoService = require('../services/contactoService');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * POST /api/contactos
 * Crea un nuevo contacto desde formulario público
 */
exports.crearContacto = asyncHandler(async (req, res) => {
  const resultado = await contactoService.crearContacto(req.body);
  res.status(201).json({
    mensaje: 'Mensaje recibido. Nos pondremos en contacto pronto.',
    contacto: resultado
  });
});

/**
 * GET /api/contactos
 * Obtiene todos los contactos (solo admin)
 */
exports.obtenerContactos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const resultado = await contactoService.obtenerContactos(page, limit);
  res.json(resultado);
});

/**
 * GET /api/contactos/:id
 * Obtiene un contacto específico (solo admin)
 */
exports.obtenerContacto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contacto = await contactoService.obtenerContacto(id);
  res.json(contacto);
});

/**
 * PUT /api/contactos/:id/contactado
 * Marca un contacto como procesado (solo admin)
 */
exports.marcarContactado = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contacto = await contactoService.marcarContactado(id);
  res.json({
    mensaje: 'Contacto marcado como contactado',
    contacto
  });
});

/**
 * DELETE /api/contactos/:id
 * Elimina un contacto (solo admin)
 */
exports.eliminarContacto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resultado = await contactoService.eliminarContacto(id);
  res.json(resultado);
});
