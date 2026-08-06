import { Component, signal, inject, OnInit, computed, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { auth } from '../../../config/firebase.config';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { environment } from '../../../../environments/environment';
import { FirebaseService } from '../../../services/firebase.service';

import { ThemeService } from '../../../services/theme.service';

interface Carrera {
  id_carrera: number;
  nombre_carrera: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly firebaseService = inject(FirebaseService);

  id_carrera = signal<number | null>(null);
  codigo_univ = signal('');
  nombres = signal('');
  apellidos = signal('');
  correo = signal('');
  password = signal('');
  ano_ingreso = signal<number | null>(null);
  ciclo_actual = signal<number | null>(null);
  selectedFileAcademicHistory = signal<File | null>(null);
  
  carreras = signal<Carrera[]>([]);
  todosLosCursos = signal<any[]>([]);
  cursosAprobadosSeleccionados = signal<number[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);

  cursosPrevios = computed(() => {
    const ciclo = Number(this.ciclo_actual());
    if (!ciclo || ciclo <= 1) return [];
    return this.todosLosCursos().filter(c => c.ciclo < ciclo);
  });

  prerequisitesMap = signal<Record<string, string[]>>({});

  cursosBloqueadosPrerequisito = computed(() => {
    const cicloVal = Number(this.ciclo_actual());
    if (!cicloVal) return [];

    const futureOrCurrentCourses = this.todosLosCursos().filter(c => c.ciclo >= cicloVal);
    const passedIds = new Set(this.cursosAprobadosSeleccionados());
    const passedNames = new Set(
      this.todosLosCursos()
        .filter(c => passedIds.has(c.id_curso))
        .map(c => c.nombre_curso.trim())
    );

    const blocked: Array<{ curso: string; prerequisitoFaltante: string }> = [];
    const prerequisitesMap = this.prerequisitesMap();

    for (const c of futureOrCurrentCourses) {
      const name = c.nombre_curso.trim();
      const prereqs = prerequisitesMap[name];
      if (prereqs) {
        for (const pr of prereqs) {
          const prereqCourse = this.todosLosCursos().find(x => x.nombre_curso.trim().toLowerCase() === pr.toLowerCase());
          if (prereqCourse && prereqCourse.ciclo < cicloVal) {
            if (!passedNames.has(prereqCourse.nombre_curso.trim())) {
              blocked.push({
                curso: c.nombre_curso,
                prerequisitoFaltante: pr
              });
            }
          }
        }
      }
    }
    return blocked;
  });

  onCarreraChange(id: any): void {
    const numericId = id !== null ? Number(id) : null;
    this.id_carrera.set(numericId);
    this.cursosAprobadosSeleccionados.set([]);
    if (numericId) {
      this.http.get<any[]>(`${environment.apiUrl}/cursos?id_carrera=${numericId}`).subscribe({
        next: (data) => this.todosLosCursos.set(data),
        error: (err) => console.error('Error al cargar cursos:', err)
      });
    } else {
      this.todosLosCursos.set([]);
    }
  }

  allCursosSelected = computed(() => {
    const prev = this.cursosPrevios();
    if (prev.length === 0) return false;
    const selected = this.cursosAprobadosSeleccionados();
    return prev.every(c => selected.includes(c.id_curso));
  });

  toggleSelectAllCursos(): void {
    if (this.allCursosSelected()) {
      const prevIds = new Set(this.cursosPrevios().map(c => c.id_curso));
      this.cursosAprobadosSeleccionados.update(current => current.filter(id => !prevIds.has(id)));
    } else {
      const prevIds = this.cursosPrevios().map(c => c.id_curso);
      this.cursosAprobadosSeleccionados.update(current => {
        const currentSet = new Set(current);
        prevIds.forEach(id => currentSet.add(id));
        return Array.from(currentSet);
      });
    }
  }

  toggleCursoAprobado(id: number): void {
    const current = this.cursosAprobadosSeleccionados();
    if (current.includes(id)) {
      this.cursosAprobadosSeleccionados.set(current.filter(x => x !== id));
    } else {
      this.cursosAprobadosSeleccionados.set([...current, id]);
    }
  }

  // Carrusel dinámico de información
  currentSlideIndex = signal(0);
  private timerId: any;

  slides = [
    {
      title: 'Crea tu cuenta <br><span class="accent">universitaria</span>',
      desc: 'Únete a la comunidad de la UNAM que mejora su rendimiento académico con tutores de su propia universidad.'
    },
    {
      title: 'Encuentra el <br><span class="accent">tutor ideal</span> para <br>tus cursos',
      desc: 'Filtra por carrera, materia y horarios. Aprende a tu propio ritmo con asesorías personalizadas virtuales.'
    },
    {
      title: 'Habilita tu <br><span class="accent">potencial</span> <br>enseñando',
      desc: 'Si tienes excelentes calificaciones, postula para ser tutor, ayuda a tus compañeros y certifica tus horas académicas.'
    }
  ];

  correoEnUso = signal(false);
  codigoEnUso = signal(false);

  constructor() {
    let emailTimeout: any;
    effect(() => {
      const email = this.correo().trim();
      if (emailTimeout) clearTimeout(emailTimeout);
      if (!email || !this.isCorreoValid()) {
        this.correoEnUso.set(false);
        return;
      }
      emailTimeout = setTimeout(() => {
        this.http.get<any>(`${environment.apiUrl}/auth/check-availability?email=${email}`).subscribe({
          next: (res) => this.correoEnUso.set(res.emailExists),
          error: (err) => console.error(err)
        });
      }, 500);
    });

    let codeTimeout: any;
    effect(() => {
      const code = this.codigo_univ().trim();
      if (codeTimeout) clearTimeout(codeTimeout);
      if (!code || !this.isCodigoValid()) {
        this.codigoEnUso.set(false);
        return;
      }
      codeTimeout = setTimeout(() => {
        this.http.get<any>(`${environment.apiUrl}/auth/check-availability?code=${code}`).subscribe({
          next: (res) => this.codigoEnUso.set(res.codeExists),
          error: (err) => console.error(err)
        });
      }, 500);
    });
  }

  // Validaciones dinámicas (Signals computadas)
  isNombresValid = computed(() => {
    const val = this.nombres().trim();
    return val.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(val);
  });
  isApellidosValid = computed(() => {
    const val = this.apellidos().trim();
    return val.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(val);
  });
  isCodigoValid = computed(() => /^\d{10}$/.test(this.codigo_univ()));
  isCarreraValid = computed(() => this.id_carrera() !== null && Number(this.id_carrera()) > 0);
  isCorreoValid = computed(() => {
    const email = this.correo().toLowerCase().trim();
    return /^[a-zA-Z0-9._%+-]+@unam\.edu\.pe$/.test(email);
  });
  isPasswordValid = computed(() => {
    const pass = this.password();
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass);
  });
  isAnoIngresoValid = computed(() => {
    const currentYear = new Date().getFullYear();
    return this.ano_ingreso() !== null && Number(this.ano_ingreso()) >= 2018 && Number(this.ano_ingreso()) <= currentYear;
  });
  isCicloActualValid = computed(() => this.ciclo_actual() !== null && Number(this.ciclo_actual()) >= 1 && Number(this.ciclo_actual()) <= 10);

  isCodigoCoherente = computed(() => {
    const cod = this.codigo_univ().trim();
    const ano = this.ano_ingreso();
    if (!cod || cod.length < 4 || !ano) return true; // solo validar coherencia si hay datos suficientes
    return cod.substring(0, 4) === ano.toString();
  });

  isFormValid = computed(() => {
    const basicValid = this.isNombresValid() && 
      this.isApellidosValid() && 
      this.isCodigoValid() && 
      this.isCarreraValid() && 
      this.isCorreoValid() && 
      this.isPasswordValid() &&
      this.isAnoIngresoValid() &&
      this.isCicloActualValid() &&
      this.isCodigoCoherente() &&
      !this.correoEnUso() &&
      !this.codigoEnUso();
    
    const cicloVal = Number(this.ciclo_actual());
    if (cicloVal > 1 && !this.selectedFileAcademicHistory()) {
      return false;
    }
    return basicValid;
  });

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFileAcademicHistory.set(file);
    } else {
      this.selectedFileAcademicHistory.set(null);
    }
  }

  formProgressPercent = computed(() => {
    let validCount = 0;
    if (this.isNombresValid()) validCount++;
    if (this.isApellidosValid()) validCount++;
    if (this.isCodigoValid()) validCount++;
    if (this.isCarreraValid()) validCount++;
    if (this.isAnoIngresoValid()) validCount++;
    if (this.isCicloActualValid()) validCount++;
    if (this.isCorreoValid()) validCount++;
    if (this.isPasswordValid()) validCount++;
    // Si ciclo > 1, también cuenta el archivo
    const cicloVal = Number(this.ciclo_actual());
    let total = 8;
    if (cicloVal > 1) {
      total = 9;
      if (this.selectedFileAcademicHistory()) validCount++;
    }
    return Math.round((validCount / total) * 100);
  });

  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  ngOnInit(): void {
    this.cargarCarreras();
    this.cargarPrerequisitos();
    // Iniciar carrusel dinámico
    this.timerId = setInterval(() => {
      this.currentSlideIndex.update(idx => (idx + 1) % this.slides.length);
    }, 4000);
  }

  showVerification = signal(false);
  verificationLoading = signal(false);
  verificationCode = signal('');
  private readonly toast = inject(NotificationService);

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  cargarCarreras(): void {
    this.http.get<Carrera[]>(`${environment.apiUrl}/carreras`).subscribe({
      next: (data) => this.carreras.set(data),
      error: (err) => console.error('Error al cargar carreras:', err)
    });
  }

  cargarPrerequisitos(): void {
    this.http.get<Record<string, string[]>>(`${environment.apiUrl}/cursos/prerequisitos`).subscribe({
      next: (data) => this.prerequisitesMap.set(data),
      error: (err) => console.error('Error al cargar prerrequisitos:', err)
    });
  }

  formSubmitted = signal(false);

  onSubmit(): void {
    this.formSubmitted.set(true);
    if (!this.isFormValid()) {
      this.errorMessage.set('Por favor, rellene todos los campos requeridos correctamente.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const email = this.correo().trim().toLowerCase();
    const pwd = this.password();

    // 1. Crear usuario en Firebase Auth primero
    createUserWithEmailAndPassword(auth, email, pwd)
      .then(async (userCredential) => {
        // 2. Solicitar al backend que envíe el código de verificación con Nodemailer
        this.authService.sendVerification(email).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.toast.showToast('Código de verificación enviado a tu cuenta.', 'success');
            this.verificationCode.set('');
            this.showVerification.set(true);
          },
          error: (err) => {
            this.isLoading.set(false);
            // Evitar cuentas huérfanas: si no se pudo enviar el correo, eliminar el usuario recién creado en Firebase Auth
            const currentUser = auth.currentUser;
            if (currentUser) {
              currentUser.delete()
                .then(() => console.log('[Registro] Cuenta de Firebase eliminada por fallo al enviar el código.'))
                .catch((delErr) => console.error('[Registro] No se pudo eliminar la cuenta huérfana:', delErr));
            }
            const errorMsg = err.error?.error || 'Error al enviar el código de verificación.';
            this.errorMessage.set(errorMsg);
            this.toast.showToast(errorMsg, 'error');
          }
        });
      })
      .catch((error) => {
        this.isLoading.set(false);
        console.error('Error al registrar en Firebase:', error);
        let errorMsg = 'Error al registrar el usuario.';
        if (error.code === 'auth/email-already-in-use') {
          errorMsg = 'El correo institucional ya está registrado.';
        } else if (error.code === 'auth/weak-password') {
          errorMsg = 'La contraseña es muy débil (debe tener al menos 6 caracteres).';
        } else if (error.code === 'auth/invalid-email') {
          errorMsg = 'El formato del correo es inválido.';
        }
        this.errorMessage.set(errorMsg);
        this.toast.showToast(errorMsg, 'error');
      });
  }

  verifyAndRegister(): void {
    const user = auth.currentUser;
    if (!user) {
      this.toast.showToast('No se encontró sesión de Firebase. Vuelve a intentarlo.', 'error');
      return;
    }

    const email = this.correo().trim().toLowerCase();
    const code = this.verificationCode().trim();

    if (!code || code.length !== 6) {
      this.toast.showToast('Ingresa el código de 6 dígitos.', 'error');
      return;
    }

    // 1. Verificar el código OTP en nuestro backend (que a su vez marcará el correo como verificado en Firebase)
    this.authService.verifyEmail(email, code).subscribe({
      next: async (verifyRes) => {
        // 2. Recargar estado de Firebase para que el cliente detecte emailVerified = true
        try {
          await user.reload();
          
          // 3. Obtener el ID Token verificado de Firebase
          const idToken = await user.getIdToken(true); // force refresh

          // Subir archivo a Firebase Storage si se seleccionó
          let uploadPromise = Promise.resolve('');
          if (this.selectedFileAcademicHistory()) {
            const filePath = `historiales/${Date.now()}_${this.selectedFileAcademicHistory()!.name}`;
            uploadPromise = this.firebaseService.uploadFile(filePath, this.selectedFileAcademicHistory()!);
          }

          uploadPromise.then((fileUrl) => {
            const payload = {
              idToken,
              id_carrera: Number(this.id_carrera()),
              codigo_univ: this.codigo_univ(),
              nombres: this.nombres(),
              apellidos: this.apellidos(),
              correo: email,
              ano_ingreso: Number(this.ano_ingreso()),
              ciclo_actual: Number(this.ciclo_actual()),
              cursos_aprobados: this.cursosAprobadosSeleccionados(),
              url_historial_academico: fileUrl || null
            };

            // 4. Registrar/sincronizar en base de datos local
            this.http.post<any>(`${environment.apiUrl}/auth/register`, payload).subscribe({
              next: (res) => {
                this.verificationLoading.set(false);
                this.showVerification.set(false);
                this.toast.showToast('¡Registro y verificación exitosos!', 'success');
                this.successMessage.set('¡Registro exitoso! Redirigiendo al inicio de sesión...');
                auth.signOut();
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 2000);
              },
              error: (err) => {
                this.verificationLoading.set(false);
                this.toast.showToast(err.error?.error || 'Error al completar el registro en el servidor.', 'error');
              }
            });
          }).catch(uploadErr => {
            this.verificationLoading.set(false);
            console.error('Error al subir historial académico:', uploadErr);
            this.toast.showToast('Error al subir el historial académico.', 'error');
          });
        } catch (reloadErr) {
          this.verificationLoading.set(false);
          console.error('Error al recargar usuario:', reloadErr);
          this.toast.showToast('Error al actualizar el estado de verificación de Firebase.', 'error');
        }
      },
      error: (err) => {
        this.verificationLoading.set(false);
        const errorMsg = err.error?.error || 'Código incorrecto o expirado.';
        this.toast.showToast(errorMsg, 'error');
      }
    });
  }

  resendVerificationCode(): void {
    const email = this.correo().trim().toLowerCase();
    if (!email) return;

    this.toast.showToast('Reenviando código...');
    this.authService.sendVerification(email).subscribe({
      next: () => {
        this.toast.showToast('Código de verificación reenviado.', 'success');
      },
      error: (err) => {
        console.error('Error al reenviar código:', err);
        this.toast.showToast('Error al reenviar el código.', 'error');
      }
    });
  }
}
