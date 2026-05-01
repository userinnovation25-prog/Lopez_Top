const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    contrasena: {
      type: String,
      required: true,
      minlength: 6,
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
    },
    rol: {
      type: String,
      enum: ["admin", "usuario"],
      default: "usuario",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Encriptar contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("contrasena")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.contrasena = await bcryptjs.hash(this.contrasena, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Comparar contraseñas
usuarioSchema.methods.compararContrasena = async function (contrasena) {
  return await bcryptjs.compare(contrasena, this.contrasena);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
