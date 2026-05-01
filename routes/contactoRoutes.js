const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoController");
const { autenticar, requiereAdmin } = require("../middlewares/autenticacion");

// Ruta pública - Crear contacto
router.post("/", contactoController.crearContacto);

// Rutas solo admin
router.get("/", autenticar, requiereAdmin, contactoController.obtenerContactos);
router.get("/:id", autenticar, requiereAdmin, contactoController.obtenerContacto);
router.put("/:id/contactado", autenticar, requiereAdmin, contactoController.marcarContactado);
router.delete("/:id", autenticar, requiereAdmin, contactoController.eliminarContacto);

module.exports = router;
