/**
 * Servicio de Autenticación
 * Lógica centralizada de autenticación, separada de controladores
 */

const Usuario = require("../models/Usuario");
const { generarToken, verificarToken } = require("../utils/jwt");
const {
  validarEmail,
  validarContrasena,
  validarNombre,
  validarObjectId,
} = require("../middlewares/validacion");

class AuthService {
  /**
   * Registra un nuevo usuario (estado pendiente)
   */
  async registrar(datos) {
    const { nombre, correo, contrasena, contraseña } = datos;
    const contrasenaNormalizada = contrasena ?? contraseña;

    // Validaciones
    const nombreValido = validarNombre(nombre);
    const correoValido = validarEmail(correo);
    const contraseniaValida = validarContrasena(contrasenaNormalizada);

    // Verificar si usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo: correoValido });
    if (usuarioExistente) {
      const error = new Error("El correo ya está registrado");
      error.statusCode = 409; // Conflict
      throw error;
    }

    // Crear usuario (estado por defecto: "pendiente")
    const nuevoUsuario = new Usuario({
      nombre: nombreValido,
      correo: correoValido,
      contrasena: contraseniaValida,
      estado: "pendiente",
      rol: "usuario",
      activo: true,
    });

    await nuevoUsuario.save();

    return {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      estado: nuevoUsuario.estado,
      mensaje: "Registro exitoso. Espera aprobación del administrador.",
    };
  }

  /**
   * Login de usuario
   */
  async login(correo, contrasena) {
    // Validaciones
    const correoValido = validarEmail(correo);
    if (!contrasena) {
      const error = new Error("La contraseña es requerida");
      error.statusCode = 400;
      throw error;
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo: correoValido });
    if (!usuario) {
      const error = new Error("Correo o contraseña incorrectos");
      error.statusCode = 401;
      throw error;
    }

    // Verificar contraseña
    const esValida = await usuario.compararContrasena(contrasena);
    if (!esValida) {
      const error = new Error("Correo o contraseña incorrectos");
      error.statusCode = 401;
      throw error;
    }

    // Verificar si usuario está aprobado
    if (usuario.estado !== "aprobado") {
      const error = new Error(
        `No puedes acceder. Tu cuenta está ${usuario.estado}`,
      );
      error.statusCode = 403;
      throw error;
    }

    // Verificar si usuario está activo
    if (!usuario.activo) {
      const error = new Error("Tu cuenta ha sido desactivada");
      error.statusCode = 403;
      throw error;
    }

    // Generar token
    const token = generarToken({
      id: usuario._id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    return {
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }

  /**
   * Cambia la contraseña validando la contraseña actual
   */
  async cambiarContrasena(correo, contrasenaActual, nuevaContrasena) {
    const correoValido = validarEmail(correo);
    const contrasenaActualValida = validarContrasena(contrasenaActual);
    const nuevaContrasenaValida = validarContrasena(nuevaContrasena);

    const usuario = await Usuario.findOne({ correo: correoValido });
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const esValida = await usuario.compararContrasena(contrasenaActualValida);
    if (!esValida) {
      const error = new Error("La contraseña actual no es correcta");
      error.statusCode = 401;
      throw error;
    }

    usuario.contrasena = nuevaContrasenaValida;
    await usuario.save();

    return {
      mensaje: "Contraseña actualizada exitosamente",
    };
  }

  /**
   * Recupera la contraseña por correo
   */
  async recuperarContrasena(correo, nuevaContrasena) {
    const correoValido = validarEmail(correo);
    const nuevaContrasenaValida = validarContrasena(nuevaContrasena);

    const usuario = await Usuario.findOne({ correo: correoValido });
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (usuario.estado !== "aprobado") {
      const error = new Error("Solo usuarios aprobados pueden recuperar la contraseña");
      error.statusCode = 403;
      throw error;
    }

    if (!usuario.activo) {
      const error = new Error("La cuenta está desactivada");
      error.statusCode = 403;
      throw error;
    }

    usuario.contrasena = nuevaContrasenaValida;
    await usuario.save();

    return {
      mensaje: "Contraseña restablecida exitosamente. Ya puedes iniciar sesión.",
    };
  }

  /**
   * Obtiene perfil del usuario autenticado
   */
  async obtenerPerfil(usuarioId) {
    const usuario = await Usuario.findById(usuarioId).select("-contrasena");
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return usuario;
  }

  /**
   * Obtiene usuarios pendientes (solo admin)
   */
  async obtenerPendientes() {
    const pendientes = await Usuario.find({ estado: "pendiente" })
      .select("-contrasena")
      .sort({ createdAt: -1 });
    return pendientes;
  }

  /**
   * Obtiene todos los usuarios (solo admin)
   */
  async obtenerUsuarios() {
    const usuarios = await Usuario.find({})
      .select("-contrasena")
      .sort({ createdAt: -1 });
    return usuarios;
  }

  /**
   * Aprueba un usuario pendiente (solo admin)
   */
  async aprobarUsuario(usuarioId) {
    const usuario = await Usuario.findByIdAndUpdate(
      usuarioId,
      { estado: "aprobado" },
      { new: true },
    ).select("-contrasena");

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return usuario;
  }

  /**
   * Rechaza un usuario pendiente (solo admin)
   */
  async rechazarUsuario(usuarioId) {
    const usuario = await Usuario.findByIdAndUpdate(
      usuarioId,
      { estado: "rechazado" },
      { new: true },
    ).select("-contrasena");

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return usuario;
  }

  /**
   * Cambia el rol del usuario entre "usuario" y "admin"
   */
  async actualizarRol(usuarioId, rol, solicitanteId) {
    const idValido = validarObjectId(usuarioId);
    const rolesPermitidos = ["usuario", "admin"];

    if (!rolesPermitidos.includes(rol)) {
      const error = new Error("Rol inválido");
      error.statusCode = 400;
      throw error;
    }

    if (solicitanteId && idValido === solicitanteId) {
      const error = new Error("No puedes cambiar tu propio rol desde este panel");
      error.statusCode = 400;
      throw error;
    }

    const usuario = await Usuario.findById(idValido).select("-contrasena");
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (usuario.estado !== "aprobado") {
      const error = new Error("Solo puedes cambiar el rol de usuarios aprobados");
      error.statusCode = 400;
      throw error;
    }

    usuario.rol = rol;
    await usuario.save();

    return usuario;
  }

  /**
   * Elimina un usuario del sistema
   */
  async eliminarUsuario(usuarioId, solicitanteId) {
    const idValido = validarObjectId(usuarioId);

    if (solicitanteId && idValido === solicitanteId) {
      const error = new Error("No puedes eliminar tu propia cuenta desde este panel");
      error.statusCode = 400;
      throw error;
    }

    const usuario = await Usuario.findById(idValido);
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (usuario.rol === "admin") {
      const totalAdmins = await Usuario.countDocuments({ rol: "admin" });
      if (totalAdmins <= 1) {
        const error = new Error("No puedes eliminar el último administrador");
        error.statusCode = 400;
        throw error;
      }
    }

    await Usuario.findByIdAndDelete(idValido);

    return {
      mensaje: "Usuario eliminado exitosamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    };
  }
}

module.exports = new AuthService();
