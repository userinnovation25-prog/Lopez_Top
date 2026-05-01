/**
 * Servicio de Contactos
 * Lógica centralizada de contactos, separada de controladores
 */

const Contacto = require('../models/Contacto');
const { 
  validarEmail, 
  validarNombre, 
  validarCelular, 
  validarMensaje,
  validarObjectId
} = require('../middlewares/validacion');

class ContactoService {
  /**
   * Crea un nuevo contacto desde formulario público
   */
  async crearContacto(datos) {
    const { nombre, celular, correo, mensaje } = datos;

    // Validaciones
    const nombreValido = validarNombre(nombre);
    const celularValido = validarCelular(celular);
    const correoValido = validarEmail(correo);
    const mensajeValido = validarMensaje(mensaje);

    // Crear contacto
    const nuevoContacto = new Contacto({
      nombre: nombreValido,
      celular: celularValido,
      correo: correoValido,
      mensaje: mensajeValido,
      estado: 'pendiente'
    });

    await nuevoContacto.save();

    return {
      id: nuevoContacto._id,
      mensaje: 'Mensaje recibido. Nos pondremos en contacto pronto.'
    };
  }

  /**
   * Obtiene todos los contactos (admin)
   * @param {number} page - Página para paginación (default: 1)
   * @param {number} limit - Cantidad por página (default: 10)
   */
  async obtenerContactos(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [contactos, total] = await Promise.all([
      Contacto.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Contacto.countDocuments()
    ]);

    return {
      contactos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtiene un contacto específico (admin)
   */
  async obtenerContacto(contactoId) {
    validarObjectId(contactoId);

    const contacto = await Contacto.findById(contactoId);
    if (!contacto) {
      const error = new Error('Contacto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return contacto;
  }

  /**
   * Marca un contacto como procesado (admin)
   */
  async marcarContactado(contactoId) {
    validarObjectId(contactoId);

    const contacto = await Contacto.findByIdAndUpdate(
      contactoId,
      { estado: 'contactado' },
      { new: true }
    );

    if (!contacto) {
      const error = new Error('Contacto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return contacto;
  }

  /**
   * Elimina un contacto (admin)
   */
  async eliminarContacto(contactoId) {
    validarObjectId(contactoId);

    const contacto = await Contacto.findByIdAndDelete(contactoId);
    if (!contacto) {
      const error = new Error('Contacto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return { mensaje: 'Contacto eliminado exitosamente' };
  }
}

module.exports = new ContactoService();
