require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require("crypto");
const Usuario = require("./models/Usuario");
const connectDB = require("./config/database");
/**
 * Script de Seeding
 * Crea usuario admin inicial para el sistema
 *
 * Uso: node seed.js
 */

async function seedAdmin() {
  try {
    // Usar la configuración centralizada para conectar
    await connectDB();
    console.log("Conectado a MongoDB");

    // Verificar si admin ya existe
    const adminExistente = await Usuario.findOne({
      correo: "admin@lopeztop.com",
    });
    if (adminExistente) {
      console.log("Admin ya existe. No se creará un nuevo admin.");
      process.exit(0);
    }

    // Generar contraseña aleatoria segura si no existe ADMIN_PASSWORD
    const contraseniaAdmin =
      process.env.ADMIN_PASSWORD || crypto.randomBytes(8).toString("hex");

    // Crear admin
    const admin = new Usuario({
      nombre: "Admin LopezTop",
      correo: "admin@lopeztop.com",
      // El modelo se encarga de hashear la contraseña una sola vez en pre("save")
      contrasena: contraseniaAdmin,
      rol: "admin",
      estado: "aprobado",
      activo: true,
    });

    await admin.save();

    console.log(`
╔════════════════════════════════════════╗
║     ADMIN CREADO EXITOSAMENTE     ║
╠════════════════════════════════════════╣
║ Nombre:       Admin LopezTop
║ Email:        admin@lopeztop.com
║ Contraseña:   ${contraseniaAdmin}
║ Rol:          admin
║ Estado:       aprobado
╠════════════════════════════════════════╣
║   IMPORTANTE:
║ 1. Guarda esta contraseña en un lugar seguro
║ 2. Cámbiala después del primer login
║ 3. Nunca comitas credenciales en git
║ 4. Usa variables de entorno en producción
╚════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error("Error al crear admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
