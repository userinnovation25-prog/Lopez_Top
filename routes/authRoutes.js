const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { autenticar, requiereAdmin } = require("../middlewares/autenticacion");

// Rutas públicas
router.post("/registro", authController.registro);
router.post("/login", authController.login);
router.post("/cambiar-password", authController.cambiarContrasena);
router.post("/recuperar-password", authController.recuperarContrasena);

// Rutas protegidas
router.get("/me", autenticar, authController.obtenerUsuarioActual);

// Rutas solo admin
router.get("/pendientes", autenticar, requiereAdmin, authController.obtenerPendientes);
router.get("/usuarios", autenticar, requiereAdmin, authController.obtenerUsuarios);
router.put("/aprobar/:id", autenticar, requiereAdmin, authController.aprobarUsuario);
router.put("/rechazar/:id", autenticar, requiereAdmin, authController.rechazarUsuario);
router.put("/rol/:id", autenticar, requiereAdmin, authController.actualizarRol);
router.delete("/usuarios/:id", autenticar, requiereAdmin, authController.eliminarUsuario);

module.exports = router;
