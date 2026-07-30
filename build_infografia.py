import subprocess
import os

html_infografia = '''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Infografía del Proyecto - UNAMConnect</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  
  body {
    font-family: 'Outfit', sans-serif;
    color: #0f172a;
    background: #f8fafc;
    margin: 0;
    padding: 0;
    font-size: 11.5px;
    line-height: 1.4;
  }

  .poster {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  }

  .header {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0284c7 100%);
    color: #ffffff;
    padding: 20px 24px;
    border-radius: 12px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-titles h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    color: #38bdf8;
    letter-spacing: -0.5px;
  }

  .header-titles p {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #e2e8f0;
    font-weight: 400;
  }

  .header-badges {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
  }

  .badge {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #38bdf8;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 600;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .card-pillar {
    background: #ffffff;
    border-radius: 10px;
    padding: 14px;
    border: 1px solid #cbd5e1;
    position: relative;
  }

  .card-pillar.alumno { border-top: 5px solid #0284c7; }
  .card-pillar.tutor { border-top: 5px solid #10b981; }
  .card-pillar.moderador { border-top: 5px solid #8b5cf6; }

  .pillar-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card-pillar.alumno .pillar-title { color: #0284c7; }
  .card-pillar.tutor .pillar-title { color: #047857; }
  .card-pillar.moderador .pillar-title { color: #6d28d9; }

  ul.feature-list {
    margin: 0;
    padding-left: 16px;
  }

  ul.feature-list li {
    margin-bottom: 5px;
  }

  .section-title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 14px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stack-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .stack-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
  }

  .stack-card strong {
    display: block;
    font-size: 12px;
    color: #0f172a;
    margin-bottom: 2px;
  }

  .stack-card span {
    font-size: 10px;
    color: #64748b;
  }

  .flow-box {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 14px;
  }

  .flow-steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .flow-step {
    background: #ffffff;
    border: 1px solid #38bdf8;
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 600;
    color: #0284c7;
    text-align: center;
    flex: 1;
    margin: 0 4px;
  }

  .flow-arrow {
    color: #0284c7;
    font-weight: bold;
    font-size: 14px;
  }

  .footer-note {
    text-align: center;
    font-size: 10px;
    color: #64748b;
    margin-top: 12px;
    border-top: 1px dashed #cbd5e1;
    padding-top: 8px;
  }
</style>
</head>
<body>

<div class="poster">
  
  <!-- HEADER -->
  <div class="header">
    <div class="header-titles">
      <h1>UNAMConnect</h1>
      <p>Plataforma Web de Tutorías Académicas — Universidad Nacional de Moquegua</p>
    </div>
    <div class="header-badges">
      <span class="badge">📌 GitHub: JeffCortez23/UNAMConnect</span>
      <span class="badge">🌐 Web: unamconnect.onrender.com</span>
    </div>
  </div>

  <!-- RESUMEN EJECUTIVO -->
  <div class="flow-box">
    <strong>💡 Propósito del Sistema:</strong> Conectar de forma rápida y segura a estudiantes y tutores universitarios para agendar asesorías, chatear en tiempo real y fortalecer el rendimiento académico sin barreras.
  </div>

  <!-- PILARES POR ROL -->
  <div class="section-title">👥 Funcionalidades Principales por Rol de Usuario</div>
  
  <div class="grid-3">
    
    <!-- ALUMNO -->
    <div class="card-pillar alumno">
      <div class="pillar-title">🎓 Módulo Alumno</div>
      <ul class="feature-list">
        <li><b>Exploración por Ciclos:</b> Consulta asignaturas desde el Ciclo I al X.</li>
        <li><b>Catálogo de Tutores:</b> Filtra por carrera, materia o nombre.</li>
        <li><b>Modal Rápido de Chat:</b> Envía mensajes directos en 1 clic.</li>
        <li><b>Agendamiento 24h:</b> Selecciona fechas y bloques disponibles.</li>
        <li><b>Postular a Tutor:</b> Adjunta Boleta de Notas en PDF.</li>
        <li><b>Google Meet:</b> Acceso directo a salas virtuales.</li>
        <li><b>Calificación:</b> Valora con estrellas (1 a 5) y comentarios.</li>
      </ul>
    </div>

    <!-- TUTOR -->
    <div class="card-pillar tutor">
      <div class="pillar-title">👨‍🏫 Módulo Tutor</div>
      <ul class="feature-list">
        <li><b>Horarios 24h:</b> Disponibilidad semanal de 6 días (Lun-Sáb).</li>
        <li><b>Atajos Frecuentes:</b> Bloques de 1-clic (ej: 08:00 - 10:00).</li>
        <li><b>Google Meet Automático:</b> Generación de enlace al aceptar.</li>
        <li><b>Toggles de Cursos:</b> Activa o desactiva materias en el catálogo.</li>
        <li><b>Recursos Académicos:</b> Publica guías y ejercicios en PDF.</li>
        <li><b>Gestión de Peticiones:</b> Acepta o rechaza solicitudes entrantes.</li>
      </ul>
    </div>

    <!-- MODERADOR -->
    <div class="card-pillar moderador">
      <div class="pillar-title">🛡️ Módulo Moderador</div>
      <ul class="feature-list">
        <li><b>Visor de Boletas:</b> Revisa expedientes y PDFs adjuntos.</li>
        <li><b>Aprobación de Tutores:</b> Otorga el rol de Tutor en 1 clic.</li>
        <li><b>Administración:</b> Gestión de cuentas, claves y roles.</li>
        <li><b>Malla Curricular:</b> Crea y edita Carreras y Cursos por ciclo.</li>
        <li><b>Métricas KPIs:</b> Monitorea horas dictadas y satisfacción.</li>
      </ul>
    </div>

  </div>

  <!-- FLUJO DEL PROCESO -->
  <div class="section-title">🔄 Flujo del Proceso de Tutoría</div>
  <div class="flow-box">
    <div class="flow-steps">
      <div class="flow-step">1. Registro de Alumno (@unam.edu.pe)</div>
      <span class="flow-arrow">➔</span>
      <div class="flow-step">2. Postulación a Tutor (Boleta PDF)</div>
      <span class="flow-arrow">➔</span>
      <div class="flow-step">3. Validación por Moderador</div>
      <span class="flow-arrow">➔</span>
      <div class="flow-step">4. Agendamiento de Clase (24h)</div>
      <span class="flow-arrow">➔</span>
      <div class="flow-step">5. Reunión Google Meet + Valoración</div>
    </div>
  </div>

  <!-- STACK TECNOLÓGICO -->
  <div class="section-title">💻 Arquitectura y Stack Tecnológico</div>
  
  <div class="stack-grid">
    <div class="stack-card">
      <strong>Angular 19</strong>
      <span>Frontend SPA, Signals & Standalone</span>
    </div>
    <div class="stack-card">
      <strong>Node.js & Express</strong>
      <span>API RESTful, JWT & Middlewares</span>
    </div>
    <div class="stack-card">
      <strong>PostgreSQL</strong>
      <span>Base Relacional (13 Tablas)</span>
    </div>
    <div class="stack-card">
      <strong>Firebase Cloud</strong>
      <span>Auth & Storage de PDFs</span>
    </div>
    <div class="stack-card">
      <strong>Render Platform</strong>
      <span>Despliegue CI/CD Continuo</span>
    </div>
  </div>

  <div class="footer-note">
    UNAMConnect es una iniciativa independiente hecha por estudiantes para estudiantes sin fines de lucro.
  </div>

</div>

</body>
</html>'''

with open('Infografia_UNAMConnect.html', 'w', encoding='utf-8') as f:
    f.write(html_infografia)

# Convert to PDF
cmd = ['chromium', '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', '--print-to-pdf=Infografia_UNAMConnect.pdf', 'Infografia_UNAMConnect.html']
subprocess.run(cmd, check=True)
print('PDF Infografia_UNAMConnect.pdf generado con éxito.')

# Write Markdown mirror
md_infografia = '''# Infografía General del Proyecto — UNAMConnect
**Portal de Tutorías Académicas de la Universidad Nacional de Moquegua**

* **GitHub**: [https://github.com/JeffCortez23/UNAMConnect](https://github.com/JeffCortez23/UNAMConnect)
* **Plataforma Web**: [https://unamconnect.onrender.com](https://unamconnect.onrender.com)

---

## 💡 Propósito del Sistema
UNAMConnect es una plataforma web hecha por estudiantes para estudiantes sin fines de lucro, diseñada para conectar a la comunidad universitaria de la UNAM, permitiendo agendar asesorías, chatear en tiempo real y gestionar horarios de manera intuitiva.

---

## 👥 Funcionalidades Principales por Rol

### 🎓 1. Módulo Alumno
* **Exploración por Ciclos**: Consulta asignaturas desde el Ciclo I al Ciclo X.
* **Catálogo de Tutores**: Filtra por carrera, materia o nombre del tutor.
* **Modal Rápido de Chat**: Envía mensajes emergentes directos en 1 clic.
* **Agendamiento 24h**: Selecciona fechas y bloques de horarios disponibles.
* **Postular a Tutor**: Adjunta tu Boleta de Notas en PDF para evaluación.
* **Google Meet**: Enlace directo generado automáticamente al aceptar la cita.
* **Calificación**: Valora las sesiones con 1 a 5 estrellas y comentarios.

### 👨‍🏫 2. Módulo Tutor
* **Disponibilidad 24h**: Configura bloques de atención de Lunes a Sábado.
* **Atajos Frecuentes**: Selección de 1-clic para bloques comunes (`08:00 - 10:00`, `14:00 - 16:00`).
* **Google Meet Automático**: Creación instantánea de sala virtual al aceptar la solicitud.
* **Toggles de Cursos**: Activa o desactiva materias en el catálogo público en tiempo real.
* **Recursos Académicos**: Publica guías de práctica y ejercicios en PDF.

### 🛡️ 3. Módulo Moderador
* **Visor de Boletas**: Inspecciona expedientes académicos y PDFs adjuntos.
* **Aprobación de Tutores**: Otorga el rol de Tutor y activa materias con 1 clic.
* **Gestión Institucional**: Administra usuarios, claves, carreras y cursos.
* **Métricas KPIs**: Visualiza horas dictadas, alumnos beneficiados y promedio de satisfacción.

---

## 🔄 Flujo del Proceso de Tutoría
`1. Registro de Alumno (@unam.edu.pe)` ➔ `2. Postulación a Tutor (Boleta PDF)` ➔ `3. Validación por Moderador` ➔ `4. Agendamiento de Clase (24h)` ➔ `5. Reunión Google Meet + Valoración`

---

## 💻 Arquitectura y Stack Tecnológico
* **Frontend**: Angular 19 (Signals, Standalone Components, Bootstrap 5).
* **Backend**: Node.js & Express (API RESTful, JWT, bcrypt, Multer).
* **Base de Datos**: PostgreSQL 14+ (13 tablas relacionales estructuradas).
* **Servicios Cloud**: Firebase Auth & Firebase Storage (expedientes en la nube).
* **Despliegue**: Render Platform (Pipeline de Integración Continua CI/CD).
'''

with open('Infografia_UNAMConnect.md', 'w', encoding='utf-8') as f:
    f.write(md_infografia)

print('Markdown Infografia_UNAMConnect.md generado con éxito.')
