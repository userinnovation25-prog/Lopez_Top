/**
 * Controlador de Autenticación
 * Maneja rutas y request/response, delega lógica a authService
 */

const authService = require('../services/authService');
const { asyncHandler } = require('../middlewares/errorHandler');
const { generarToken } = require('../utils/jwt');

/**
 * POST /api/auth/registro
 * Registra un nuevo usuario (estado pendiente)
 */
exports.registro = asyncHandler(async (req, res) => {
  const resultado = await authService.registrar(req.body);
  res.status(201).json({
    mensaje: 'Usuario registrado exitosamente. Espera aprobación del administrador.',
    usuario: resultado
  });
});

/**
 * POST /api/auth/login
 * Autentica usuario y retorna token JWT
 */
exports.login = asyncHandler(async (req, res) => {
  const { correo, contrasena, contraseña } = req.body;
  const resultado = await authService.login(correo, contrasena ?? contraseña);
  res.json({
    mensaje: 'Login exitoso',
    token: resultado.token,
    usuario: resultado.usuario
  });
});

/**
 * POST /api/auth/cambiar-password
 * Cambia la contraseña con correo + contraseña actual
 */
exports.cambiarContrasena = asyncHandler(async (req, res) => {
  const {
    correo,
    contrasenaActual,
    contraseñaActual,
    nuevaContrasena,
    nuevaContraseña
  } = req.body;

  const resultado = await authService.cambiarContrasena(
    correo,
    contrasenaActual ?? contraseñaActual,
    nuevaContrasena ?? nuevaContraseña
  );

  res.json(resultado);
});

/**
 * POST /api/auth/recuperar-password
 * Restablece contraseña desde el área de login
 */
exports.recuperarContrasena = asyncHandler(async (req, res) => {
  const { correo, nuevaContrasena, nuevaContraseña } = req.body;

  const resultado = await authService.recuperarContrasena(
    correo,
    nuevaContrasena ?? nuevaContraseña
  );

  res.json(resultado);
});

/**
 * GET /api/auth/me
 * Obtiene perfil del usuario autenticado
 */
exports.obtenerUsuarioActual = asyncHandler(async (req, res) => {
  const usuario = await authService.obtenerPerfil(req.usuario.id);
  res.json(usuario);
});

/**
 * GET /api/auth/pendientes
 * Obtiene usuarios pendientes de aprobación (solo admin)
 */
exports.obtenerPendientes = asyncHandler(async (req, res) => {
  const pendientes = await authService.obtenerPendientes();
  res.json(pendientes);
});

/**
 * GET /api/auth/usuarios
 * Obtiene todos los usuarios (solo admin)
 */
exports.obtenerUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await authService.obtenerUsuarios();
  res.json(usuarios);
});

/**
 * PUT /api/auth/aprobar/:id
 * Aprueba un usuario pendiente (solo admin)
 */
exports.aprobarUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usuario = await authService.aprobarUsuario(id);
  res.json({
    mensaje: 'Usuario aprobado exitosamente',
    usuario
  });
});

/**
 * PUT /api/auth/rechazar/:id
 * Rechaza un usuario pendiente (solo admin)
 */
exports.rechazarUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usuario = await authService.rechazarUsuario(id);
  res.json({
    mensaje: 'Usuario rechazado',
    usuario
  });
});

/**
 * PUT /api/auth/rol/:id
 * Cambia el rol entre usuario y admin (solo admin)
 */
exports.actualizarRol = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;
  const usuario = await authService.actualizarRol(id, rol, req.usuario.id);

  res.json({
    mensaje: `Rol actualizado a ${usuario.rol}`,
    usuario
  });
});

/**
 * DELETE /api/auth/usuarios/:id
 * Elimina un usuario (solo admin)
 */
exports.eliminarUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resultado = await authService.eliminarUsuario(id, req.usuario.id);
  res.json(resultado);
});
