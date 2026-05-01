# 🌐 LopezTop - Sistema Completo de Topografía y Admin Panel

Sistema profesional para empresa de servicios topográficos con panel administrativo completo.

## 📋 Características

### Frontend
- ✅ Página inicio con hero video
- ✅ Sección de servicios detallada
- ✅ Sección Nosotros con información institucional
- ✅ Formulario de contacto funcional
- ✅ Diseño responsive
- ✅ Navegación mobile con menú hamburguesa

### Backend
- ✅ Node.js + Express + MongoDB
- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas (bcrypt)
- ✅ Validación y sanitización de datos
- ✅ CORS habilitado

### Panel Admin
- ✅ Sistema de registro y login
- ✅ Aprobación de usuarios pendientes
- ✅ Dashboard con estadísticas
- ✅ Gestión de contactos
- ✅ Sistema de notificaciones

---

## 🚀 Instalación y Configuración

### Requisitos
- Node.js v14+
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar e instalar dependencias

```bash
cd LopezTop
npm install
```

### 2. Configurar variables de entorno

Edita `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lopeztop
JWT_SECRET=tu-clave-secreta-aqui
NODE_ENV=development
```

### 3. Iniciar servidor MongoDB

```bash
# En otra terminal
mongod
```

### 4. Iniciar servidor backend

```bash
npm start
# o para desarrollo con nodemon
npm run dev
```

El servidor estará en: `http://localhost:5000`

---

## 📊 Estructura del Proyecto

```
LopezTop/
├── admin/
│   ├── login.html
│   ├── index.html (Dashboard)
│   ├── css/admin.css
│   └── js/admin.js
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── contactoController.js
├── middlewares/
│   └── autenticacion.js
├── models/
│   ├── Usuario.js
│   └── Contacto.js
├── routes/
│   ├── authRoutes.js
│   └── contactoRoutes.js
├── js/
│   ├── button_burguer.js
│   └── contacto.js
├── css/
│   └── styles.css
├── index.html
├── contacto.html
├── package.json
├── server.js
└── .env
```

---

## 🔑 API Endpoints

### Autenticación
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)
- `GET /api/auth/pendientes` - Listar usuarios pendientes (solo admin)
- `PUT /api/auth/aprobar/:id` - Aprobar usuario (solo admin)
- `PUT /api/auth/rechazar/:id` - Rechazar usuario (solo admin)

### Contactos
- `POST /api/contactos` - Crear contacto (público)
- `GET /api/contactos` - Listar contactos (solo admin)
- `GET /api/contactos/:id` - Obtener detalle (solo admin)
- `PUT /api/contactos/:id/contactado` - Marcar como contactado (solo admin)
- `DELETE /api/contactos/:id` - Eliminar contacto (solo admin)

---

## 👤 Flujo de Usuarios

### 1. Registro
1. Usuario nuevo accede a `/admin/login.html`
2. Hace clic en "Regístrate aquí"
3. Completa formulario y se registra
4. **Estado inicial:** `pendiente`
5. No puede hacer login hasta aprobación

### 2. Aprobación (Admin)
1. Admin accede a `/admin` (requiere tener rol admin)
2. Va a "Usuarios Pendientes"
3. Aprueba o rechaza usuarios
4. Usuario aprobado puede hacer login

### 3. Login
1. Usuario aprobado va a `/admin/login.html`
2. Inicia sesión con credenciales
3. Se le asigna JWT token
4. Accede al dashboard

---

## 📝 Formulario de Contacto

Los contactos enviados desde `/contacto.html`:
- Se guardan en MongoDB
- Estado inicial: `pendiente`
- Admin puede marcar como `contactado`

**Campos:**
- Nombre completo
- Email
- Celular
- Mensaje

---

## 🛡️ Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ JWT para autenticación
- ✅ Validación de emails con validator.js
- ✅ Sanitización de inputs
- ✅ CORS configurado
- ✅ Middleware de autenticación

---

## 🎯 Próximos Pasos

### Para producción:
1. Cambiar `JWT_SECRET` por una clave segura
2. Configurar MongoDB Atlas
3. Variables de entorno separadas por ambiente
4. Agregar logs
5. Implementar rate limiting
6. Configurar HTTPS
7. Deployar en servidor (Heroku, Railway, etc.)

---

## 📱 Acceso

### Sitio web
- Inicio: `http://localhost:5000/index.html`
- Contacto: `http://localhost:5000/contacto.html`

### Panel Admin
- Login: `http://localhost:5000/admin/login.html`
- Dashboard: `http://localhost:5000/admin/index.html`

---

## 👨‍💻 Desarrollo

Para cambios en frontend:
- Modifica archivos en raíz y `/admin`
- El servidor automáticamente sirve archivos estáticos

Para cambios en backend:
```bash
npm run dev  # Reinicia automáticamente con nodemon
```

---

## ❓ Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### MongoDB no conecta
- Asegúrate que MongoDB esté corriendo
- Verifica `MONGODB_URI` en `.env`

### CORS errors en contacto.html
- Verifica que `http://localhost:5000` esté accesible
- Comprueba que el backend esté corriendo

### Token expirado
- Los tokens expiran en 7 días
- Usuario debe hacer login de nuevo

---

## 📄 Licencia
© 2026 LopezTop S.A.S. Todos los derechos reservados.

---

**¡Sistema listo para producción! 🚀**
