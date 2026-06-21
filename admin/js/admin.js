const API_URL = `${window.location.origin}/api`;
let token = localStorage.getItem("adminToken");
let usuarioActual = null;

function obtenerMensajeError(data, fallback = "Ocurrió un error inesperado") {
  return data?.error?.message || data?.message || data?.error || fallback;
}

function obtenerUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem("adminUser"));
  } catch (error) {
    console.error("Error leyendo usuario guardado:", error);
    return null;
  }
}

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
  // Si estamos en login.html
  if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", login);
    document.getElementById("registroForm")?.addEventListener("submit", registro);
    document.getElementById("cambioPasswordForm")?.addEventListener("submit", cambiarContrasena);
    document.getElementById("recuperacionForm")?.addEventListener("submit", recuperarContrasena);
  }

  // Si estamos en index.html (dashboard)
  if (document.getElementById("dashboard")) {
    if (!token) {
      window.location.href = "login.html";
    } else {
      cargarDashboard();
      cargarContactos();
      cargarUsuariosPendientes();
      cargarControlUsuarios();
      cargarStats();
    }
  }
});

// ===== LOGIN =====
async function login(e) {
  e.preventDefault();
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contraseña").value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.usuario));
      window.location.href = "index.html";
    } else {
      alert("Error: " + obtenerMensajeError(data, "No se pudo iniciar sesión"));
    }
  } catch (error) {
    alert("Error de conexión");
    console.error(error);
  }
}

// ===== REGISTRO =====
async function registro(e) {
  e.preventDefault();
  const nombre = document.getElementById("regNombre").value;
  const correo = document.getElementById("regCorreo").value;
  const contrasena = document.getElementById("regContraseña").value;

  try {
    const response = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contrasena }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(
        "Registro exitoso! Tu cuenta está pendiente de aprobación. Un administrador la revisará pronto."
      );
      mostrarLogin(e);
      document.getElementById("registroForm").reset();
    } else {
      alert("Error: " + obtenerMensajeError(data, "No se pudo registrar"));
    }
  } catch (error) {
    alert("Error de conexión");
    console.error(error);
  }
}

// ===== ALTERNAR LOGIN/REGISTRO =====
function mostrarCajaAutenticacion(idCaja) {
  const cajas = ["loginBox", "registroBox", "cambioPasswordBox", "recuperacionBox"];
  cajas.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.style.display = id === idCaja ? "block" : "none";
    }
  });
}

function mostrarRegistro(e) {
  e.preventDefault();
  mostrarCajaAutenticacion("registroBox");
}

function mostrarLogin(e) {
  e.preventDefault();
  mostrarCajaAutenticacion("loginBox");
}

function mostrarCambioContrasena(e) {
  e.preventDefault();
  mostrarCajaAutenticacion("cambioPasswordBox");
}

function mostrarRecuperacion(e) {
  e.preventDefault();
  mostrarCajaAutenticacion("recuperacionBox");
}

function validarCoincidenciaPasswords(password, confirmacion, mensaje) {
  if (password !== confirmacion) {
    throw new Error(mensaje);
  }
}

async function cambiarContrasena(e) {
  e.preventDefault();
  const correo = document.getElementById("changeCorreo").value;
  const contrasenaActual = document.getElementById("changeActual").value;
  const nuevaContrasena = document.getElementById("changeNueva").value;
  const confirmacion = document.getElementById("changeConfirmacion").value;

  try {
    validarCoincidenciaPasswords(
      nuevaContrasena,
      confirmacion,
      "La nueva contraseña y su confirmación no coinciden"
    );

    const response = await fetch(`${API_URL}/auth/cambiar-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasenaActual, nuevaContrasena }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(obtenerMensajeError(data, "No se pudo cambiar la contraseña"));
    }

    alert(data.mensaje || "Contraseña actualizada");
    document.getElementById("cambioPasswordForm").reset();
    mostrarLogin(e);
  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);
  }
}

async function recuperarContrasena(e) {
  e.preventDefault();
  const correo = document.getElementById("recoveryCorreo").value;
  const nuevaContrasena = document.getElementById("recoveryNueva").value;
  const confirmacion = document.getElementById("recoveryConfirmacion").value;

  try {
    validarCoincidenciaPasswords(
      nuevaContrasena,
      confirmacion,
      "La nueva contraseña y su confirmación no coinciden"
    );

    const response = await fetch(`${API_URL}/auth/recuperar-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, nuevaContrasena }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(obtenerMensajeError(data, "No se pudo recuperar la contraseña"));
    }

    alert(data.mensaje || "Contraseña restablecida");
    document.getElementById("recuperacionForm").reset();
    mostrarLogin(e);
  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);
  }
}

// ===== DASHBOARD =====
async function cargarDashboard() {
  try {
    const usuario = obtenerUsuarioGuardado();
    if (usuario) {
      document.getElementById("usuarioNombre").textContent = `${usuario.nombre} (${usuario.rol})`;
    }
  } catch (error) {
    console.error(error);
  }
}

// ===== STATS =====
async function cargarStats() {
  try {
    // Contactos
    let contactosResp = await fetch(`${API_URL}/contactos`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    // Si es un objeto, extraer el array
    if (contactosResp && typeof contactosResp === 'object' && !Array.isArray(contactosResp)) {
      contactosResp = contactosResp.data || contactosResp.contactos || [];
    }

    let contactos = Array.isArray(contactosResp) ? contactosResp : [];

    const pendientes = contactos.filter((c) => c.estado === "pendiente").length;
    const atendidos = contactos.filter((c) => c.estado === "contactado").length;

    document.getElementById("statsContactosPendientes").textContent = pendientes;
    document.getElementById("statsContactosAtendidos").textContent = atendidos;

    // Usuarios pendientes
    let usuariosResp = await fetch(`${API_URL}/auth/pendientes`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    let usuarios = Array.isArray(usuariosResp) ? usuariosResp : [];

    document.getElementById("statsUsuariosPendientes").textContent = usuarios.length;

    // Actividad reciente
    const actividadContainer = document.getElementById("actividadReciente");
    if (contactos.length > 0) {
      const ultimos = contactos.slice(0, 5);
      actividadContainer.innerHTML = ultimos
        .map((c) => {
          const fecha = new Date(c.fecha).toLocaleDateString("es-CO");
          const estado = c.estado === "pendiente" ? "⏳" : "✅";
          return `<div class="activity-item">${estado} Contacto de <strong>${c.nombre}</strong> - ${fecha}</div>`;
        })
        .join("");
    } else {
      actividadContainer.innerHTML = '<p class="activity-item">Sin actividad reciente</p>';
    }
  } catch (error) {
    console.error("Error cargando stats:", error);
    document.getElementById("statsContactosPendientes").textContent = "0";
    document.getElementById("statsContactosAtendidos").textContent = "0";
    document.getElementById("statsUsuariosPendientes").textContent = "0";
  }
}

// ===== CONTACTOS =====
async function cargarContactos() {
  try {
    const response = await fetch(`${API_URL}/contactos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    let contactos = await response.json();

    // Si la respuesta es un objeto con propiedad 'data' o 'contactos', extraerlo
    if (contactos && typeof contactos === 'object' && !Array.isArray(contactos)) {
      contactos = contactos.data || contactos.contactos || [];
    }

    // Asegurar que es un array
    if (!Array.isArray(contactos)) {
      console.error('La respuesta no es un array:', contactos);
      contactos = [];
    }

    const tbody = document.getElementById("contactosTabla");

    if (contactos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay contactos</td></tr>';
      return;
    }

    tbody.innerHTML = contactos
      .map(
        (c, index) => `
        <tr>
          <td>${c.nombre || 'Sin nombre'}</td>
          <td>${c.celular || '-'}</td>
          <td>${c.correo || '-'}</td>
          <td>
            <button class="btn-accion btn-ver-mensaje" data-index="${index}">
              Ver
            </button>
          </td>
          <td>
            <span class="status-${c.estado}">${c.estado}</span>
          </td>
          <td>${new Date(c.fecha).toLocaleDateString("es-CO")}</td>
          <td>
            ${
              c.estado === "pendiente"
                ? `<button class="btn-accion" onclick="marcarContactado('${c._id}')">
                    Contactado
                  </button>`
                : "-"
            }
          </td>
        </tr>
      `
      )
      .join("");

    tbody.querySelectorAll(".btn-ver-mensaje").forEach((button) => {
      button.addEventListener("click", () => {
        const contacto = contactos[Number(button.dataset.index)];
        if (!contacto) {
          return;
        }

        verMensaje(
          contacto._id,
          contacto.nombre || "Sin nombre",
          contacto.mensaje || ""
        );
      });
    });
  } catch (error) {
    console.error("Error cargando contactos:", error);
    const tbody = document.getElementById("contactosTabla");
    tbody.innerHTML = `<tr><td colspan="7" class="loading">Error: ${error.message}</td></tr>`;
  }
}

async function marcarContactado(id) {
  try {
    const response = await fetch(`${API_URL}/contactos/${id}/contactado`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Contacto marcado como contactado");
      cargarContactos();
      cargarStats();
    } else {
      alert("Error al actualizar");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function verMensaje(id, nombre, mensaje) {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = "";

  const nombreParrafo = document.createElement("p");
  const nombreStrong = document.createElement("strong");
  nombreStrong.textContent = "Nombre:";
  nombreParrafo.appendChild(nombreStrong);
  nombreParrafo.append(` ${nombre}`);

  const mensajeTitulo = document.createElement("p");
  const mensajeStrong = document.createElement("strong");
  mensajeStrong.textContent = "Mensaje:";
  mensajeTitulo.appendChild(mensajeStrong);

  const mensajeParrafo = document.createElement("p");
  mensajeParrafo.className = "modal-mensaje-texto";
  mensajeParrafo.textContent = mensaje;

  modalBody.appendChild(nombreParrafo);
  modalBody.appendChild(mensajeTitulo);
  modalBody.appendChild(mensajeParrafo);
  document.getElementById("modalMensaje").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modalMensaje").style.display = "none";
}

// ===== USUARIOS PENDIENTES =====
async function cargarUsuariosPendientes() {
  try {
    const response = await fetch(`${API_URL}/auth/pendientes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    let usuarios = await response.json();
    const container = document.getElementById("usuariosContainer");

    // Si es un objeto, extraer el array
    if (usuarios && typeof usuarios === 'object' && !Array.isArray(usuarios)) {
      usuarios = usuarios.data || usuarios.usuarios || [];
    }

    // Asegurar que es un array
    if (!Array.isArray(usuarios)) {
      console.error('La respuesta no es un array:', usuarios);
      usuarios = [];
    }

    if (usuarios.length === 0) {
      container.innerHTML = '<p class="loading">No hay usuarios pendientes de aprobación</p>';
      return;
    }

    container.innerHTML = usuarios
      .map(
        (u) => `
        <div class="usuario-card">
          <h3>${u.nombre}</h3>
          <p><strong>Email:</strong> ${u.correo}</p>
          <p><strong>Estado:</strong> ${u.estado}</p>
          <p><strong>Registrado:</strong> ${new Date(u.createdAt).toLocaleDateString("es-CO")}</p>
          <div class="usuario-actions">
            <button class="btn-aprobar" onclick="aprobarUsuario('${u._id}')">
              <i class="fas fa-check"></i> Aprobar
            </button>
            <button class="btn-rechazar" onclick="rechazarUsuario('${u._id}')">
              <i class="fas fa-times"></i> Rechazar
            </button>
          </div>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    const container = document.getElementById("usuariosContainer");
    container.innerHTML = `<p class="loading">Error: ${error.message}</p>`;
  }
}

async function aprobarUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/auth/aprobar/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Usuario aprobado");
      cargarUsuariosPendientes();
      cargarControlUsuarios();
      cargarStats();
    } else {
      alert("Error al aprobar");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function rechazarUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/auth/rechazar/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Usuario rechazado");
      cargarUsuariosPendientes();
      cargarControlUsuarios();
      cargarStats();
    } else {
      alert("Error al rechazar");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// ===== CONTROL DE USUARIOS =====
async function cargarControlUsuarios() {
  try {
    const response = await fetch(`${API_URL}/auth/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    const container = document.getElementById("controlUsuariosContainer");

    if (!response.ok) {
      throw new Error(obtenerMensajeError(data, `Error ${response.status}`));
    }

    let usuarios = Array.isArray(data) ? data : data?.usuarios || data?.data || [];
    const usuarioSesion = obtenerUsuarioGuardado();

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      container.innerHTML = '<p class="loading">No hay usuarios registrados</p>';
      return;
    }

    container.innerHTML = usuarios
      .map((u) => {
        const esUsuarioActual = usuarioSesion?.id === u._id;
        const puedeCambiarRol = u.estado === "aprobado" && !esUsuarioActual;
        const nuevoRol = u.rol === "admin" ? "usuario" : "admin";
        const textoBoton = u.rol === "admin" ? "Quitar admin" : "Dar admin";
        const textoAyuda = esUsuarioActual
          ? "Tu cuenta actual no se puede modificar desde aquí."
          : u.estado !== "aprobado"
            ? "Aprueba primero al usuario para poder cambiar su rol."
            : "Puedes cambiar este rol cuando lo necesites.";

        return `
        <div class="usuario-card">
          <div class="usuario-card-header">
            <h3>${u.nombre}</h3>
            <span class="role-badge role-${u.rol}">${u.rol}</span>
          </div>
          <p><strong>Email:</strong> ${u.correo}</p>
          <p><strong>Estado:</strong> <span class="status-${u.estado}">${u.estado}</span></p>
          <p><strong>Registrado:</strong> ${new Date(u.createdAt).toLocaleDateString("es-CO")}</p>
          <p class="usuario-ayuda">${textoAyuda}</p>
          <div class="usuario-actions">
            <button
              class="btn-admin ${!puedeCambiarRol ? "btn-disabled" : ""}"
              onclick="${puedeCambiarRol ? `cambiarRolUsuario('${u._id}', '${nuevoRol}')` : ""}"
              ${!puedeCambiarRol ? "disabled" : ""}
            >
              <i class="fas fa-user-shield"></i> ${textoBoton}
            </button>
            <button
              class="btn-eliminar ${esUsuarioActual ? "btn-disabled" : ""}"
              onclick="${!esUsuarioActual ? `eliminarUsuario('${u._id}', '${u.nombre}')` : ""}"
              ${esUsuarioActual ? "disabled" : ""}
            >
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error cargando control de usuarios:", error);
    const container = document.getElementById("controlUsuariosContainer");
    if (container) {
      container.innerHTML = `<p class="loading">Error: ${error.message}</p>`;
    }
  }
}

async function cambiarRolUsuario(id, nuevoRol) {
  const accion = nuevoRol === "admin"
    ? "otorgar permisos de administrador a este usuario"
    : "quitar permisos de administrador a este usuario";
  const confirmado = confirm(`¿Deseas ${accion}?`);

  if (!confirmado) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/rol/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rol: nuevoRol }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(obtenerMensajeError(data, "No se pudo actualizar el rol"));
    }

    const mensaje = nuevoRol === "admin"
      ? "El usuario ahora es administrador"
      : "El usuario ahora tiene rol de usuario";

    alert(mensaje);
    cargarControlUsuarios();
  } catch (error) {
    console.error("Error cambiando rol:", error);
    alert("Error: " + error.message);
  }
}

async function eliminarUsuario(id, nombre) {
  const confirmado = confirm(`¿Deseas eliminar definitivamente a ${nombre}?`);

  if (!confirmado) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(obtenerMensajeError(data, "No se pudo eliminar el usuario"));
    }

    alert(data.mensaje || "Usuario eliminado");
    cargarControlUsuarios();
    cargarUsuariosPendientes();
    cargarStats();
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    alert("Error: " + error.message);
  }
}

// ===== NAVEGACIÓN =====
function cambiarTab(tab, e) {
  if (e) {
    e.preventDefault();
  }

  // Ocultar todos los tabs
  document.querySelectorAll(".tab-content").forEach((t) => {
    t.classList.remove("active");
  });

  // Actualizar navbar
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  if (e?.target) {
    e.target.closest(".nav-item").classList.add("active");
  }

  // Mostrar tab seleccionado
  document.getElementById(tab).classList.add("active");

  // Actualizar título
  const titulos = {
    dashboard: "Dashboard",
    contactos: "Gestión de Contactos",
    usuarios: "Usuarios Pendientes",
    controlUsuarios: "Control de Usuarios",
  };
  document.getElementById("tabTitulo").textContent = titulos[tab];

  // Recargar datos si es necesario
  if (tab === "contactos") cargarContactos();
  if (tab === "usuarios") cargarUsuariosPendientes();
  if (tab === "controlUsuarios") cargarControlUsuarios();
  if (tab === "dashboard") {
    cargarStats();
    cargarContactos();
    cargarUsuariosPendientes();
    cargarControlUsuarios();
  }
}

// ===== CERRAR SESIÓN =====
function cerrarSesion(e) {
  e.preventDefault();
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "login.html";
  }
}

// Cerrar modal al hacer click fuera
window.addEventListener("click", function (e) {
  const modal = document.getElementById("modalMensaje");
  if (modal && e.target === modal) {
    cerrarModal();
  }
});


function abrirWebmail() {
  /*const correo = document.getElementById("correo").value;

  if (!correo) {
    alert("Ingresa tu correo primero");
    return;
  }

  // Validar que sea de tu dominio
  if (!correo.endsWith("@lopeztop.com.co")) {
    alert("Usa tu correo corporativo (@lopeztop.com.co)");
    return;
  }*/

  // Abrir webmail en nueva pestaña
  window.open("https://webmail.lopeztop.com.co/", "_blank");
}
