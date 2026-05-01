const mongoose = require("mongoose");

const contactoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    celular: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    mensaje: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "contactado"],
      default: "pendiente",
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contacto", contactoSchema);
