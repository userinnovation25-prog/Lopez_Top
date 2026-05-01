document.addEventListener("DOMContentLoaded", function () {
  const enviarBtn = document.getElementById("enviarBtn");

  if (enviarBtn) {
    enviarBtn.addEventListener("click", async function () {
      const nombre = document.getElementById("nombre").value.trim();
      const correo = document.getElementById("correo").value.trim();
      const celular = document.getElementById("celular").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      // Validaciones básicas
      if (!nombre || !correo || !celular || !mensaje) {
        alert("Por favor completa todos los campos");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        alert("Por favor ingresa un email válido");
        return;
      }

      try {
        enviarBtn.disabled = true;
        enviarBtn.textContent = "Enviando...";

        const response = await fetch("http://localhost:5000/api/contactos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            correo,
            celular,
            mensaje,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("¡Mensaje enviado! Nos pondremos en contacto pronto.");
          document.getElementById("contactForm").reset();
        } else {
          alert("Error: " + (data.error || "No se pudo enviar el mensaje"));
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al enviar el mensaje. Intenta de nuevo más tarde.");
      } finally {
        enviarBtn.disabled = false;
        enviarBtn.textContent = "Enviar";
      }
    });
  }
});
