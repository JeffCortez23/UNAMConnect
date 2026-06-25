import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { NotificationService } from '../../../services/notification.service';
import { auth } from '../../../config/firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { CURRICULUM_CONFIG } from '../../../config/curriculum.config';
import { timer, of, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

interface Solicitud {
  id_solicitud: number;
  nombre_solicitante: string;
  nombre_curso: string;
  nota_obtenida: number;
  estado_solicitud: string;
  fecha_postulacion: string;
  url_boleta_notas?: string;
}

@Component({
  selector: 'app-moderator-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderator.html',
  styleUrl: '../student/student.scss'
})
export class ModeratorDashboardComponent implements OnInit, OnDestroy {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);
  private notificationSubscription?: Subscription;

  // Tab activo de Sidebar (SPA)
  activeTab = signal<string>('principal');
  sidebarCollapsed = signal(false);
  cicloAcademicoActivo = signal<string>(CURRICULUM_CONFIG.getActiveAcademicCycleString());
  // Sub-tab activo de la sección Configuración
  configSubTab = signal<string>('perfil');

  solicitudes = signal<Solicitud[]>([]);
  tutoresPendientes = signal<number>(0);
  aprobadosEsteMes = signal<number>(0);
  totalUsuariosActivos = signal<number>(0);
  totalTutores = signal<number>(0);
  usuariosList = signal<any[]>([]);

  // Listados de Cursos y Carreras
  cursosList = signal<any[]>([]);
  carrerasList = signal<any[]>([]);

  // Nuevas Métricas
  totalCursos = signal<number>(0);
  totalCarreras = signal<number>(0);
  promedioCalificaciones = signal<number>(0);
  totalAsesorias = signal<number>(0);
  asesoriasCompletadas = signal<number>(0);
  valoracionesList = signal<any[]>([]);
  showValuationsModal = signal<boolean>(false);

  // Formularios para Cursos
  cursoFormNombre = signal<string>('');
  cursoFormCarrera = signal<number | null>(null);
  cursoFormCiclo = signal<number>(1);
  editCursoId = signal<number | null>(null);

  // Formularios para Carreras
  carreraFormNombre = signal<string>('');
  carreraFormFacultad = signal<string>('');
  editCarreraId = signal<number | null>(null);

  // Señales de Salud del Sistema en tiempo real
  saludServidor = signal<string>('Comprobando...');
  saludBD = signal<string>('Comprobando...');
  almacenamientoUsado = signal<string>('--%');
  configNombres = signal('');
  configApellidos = signal('');

  // Lógica de búsqueda
  searchQuery = signal<string>('');
  searchFocused = signal<boolean>(false);

  onSearchBlur(): void {
    setTimeout(() => this.searchFocused.set(false), 200);
  }

  filteredSolicitudes(): Solicitud[] {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.solicitudes();
    return this.solicitudes().filter(s =>
      s.nombre_solicitante.toLowerCase().includes(query) ||
      s.nombre_curso.toLowerCase().includes(query)
    );
  }

  filteredUsuarios(): any[] {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.usuariosList();
    return this.usuariosList().filter(u =>
      (u.nombres && u.nombres.toLowerCase().includes(query)) ||
      (u.apellidos && u.apellidos.toLowerCase().includes(query)) ||
      (u.correo && u.correo.toLowerCase().includes(query))
    );
  }

  filteredCursos(): any[] {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.cursosList();
    return this.cursosList().filter(c =>
      c.nombre_curso.toLowerCase().includes(query) ||
      (c.nombre_carrera && c.nombre_carrera.toLowerCase().includes(query))
    );
  }

  filteredCarreras(): any[] {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.carrerasList();
    return this.carrerasList().filter(c =>
      c.nombre_carrera.toLowerCase().includes(query) ||
      c.facultad.toLowerCase().includes(query)
    );
  }

  // Notificaciones
  notificacionesList = signal<any[]>([]);
  notificationsOpen = signal<boolean>(false);
  unreadNotificationsCount = computed(() => this.notificacionesList().filter(n => !n.leido).length);

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
  }

  cargarNotificaciones(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.http.get<any[]>(`${environment.apiUrl}/notificaciones/usuario/${user.id}?rol=moderador`).subscribe({
      next: (data) => {
        this.notificacionesList.set(data);
      },
      error: (err) => console.error('Error al obtener notificaciones:', err)
    });
  }

  startNotificationPolling(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.destroyNotificationPolling();

    this.notificationSubscription = timer(0, 5000)
      .pipe(
        switchMap(() => this.http.get<any[]>(`${environment.apiUrl}/notificaciones/usuario/${user.id}?rol=moderador`).pipe(
          catchError((err) => {
            console.error('Error fetching notifications:', err);
            return of(this.notificacionesList());
          })
        ))
      )
      .subscribe({
        next: (data) => {
          this.notificacionesList.set(data);
        }
      });
  }

  destroyNotificationPolling(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  marcarLeida(n: any): void {
    const action = () => {
      this.redirigirNotificacion(n.mensaje);
    };

    if (n.leido) {
      action();
      return;
    }

    this.http.put(`${environment.apiUrl}/notificaciones/marcar-leida/${n.id_notificacion}`, {}).subscribe({
      next: () => {
        this.cargarNotificaciones();
        action();
      },
      error: (err) => console.error('Error al marcar notificación como leída:', err)
    });
  }

  redirigirNotificacion(mensaje: string): void {
    const msg = mensaje.toLowerCase();
    if (msg.includes('postulación') || msg.includes('tutor') || msg.includes('solicitud')) {
      this.activeTab.set('validar');
    } else if (msg.includes('valoración') || msg.includes('calificado') || msg.includes('estrella') || msg.includes('reporte')) {
      this.activeTab.set('principal');
    }
  }

  marcarTodasLeidas(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    const unread = this.notificacionesList().filter(n => !n.leido);
    if (unread.length === 0) return;
    
    let completed = 0;
    for (const n of unread) {
      this.http.put(`${environment.apiUrl}/notificaciones/marcar-leida/${n.id_notificacion}`, {}).subscribe({
        next: () => {
          completed++;
          if (completed === unread.length) {
            this.cargarNotificaciones();
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.startNotificationPolling();
  }

  ngOnDestroy(): void {
    this.destroyNotificationPolling();
  }

  cargarDatos(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.configNombres.set(user.nombres);
      this.configApellidos.set(user.apellidos);
    }

    // Cargar Salud del Sistema
    this.http.get<any>(`${environment.apiUrl}/health`).subscribe({
      next: (health) => {
        this.saludServidor.set(health.server);
        this.saludBD.set(health.database);
        this.almacenamientoUsado.set(health.storage);
      },
      error: (err) => {
        this.saludServidor.set('Fuera de línea');
        this.saludBD.set('Error de conexión');
        this.almacenamientoUsado.set('N/A');
      }
    });

    // 1. Cargar solicitudes de tutoría
    this.http.get<Solicitud[]>(`${environment.apiUrl}/solicitudes-tutor`).subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        
        // Calcular métricas basadas en solicitudes
        const pendientes = data.filter(s => s.estado_solicitud === 'pendiente');
        this.tutoresPendientes.set(pendientes.length);

        const aprobadas = data.filter(s => s.estado_solicitud === 'aprobada');
        this.aprobadosEsteMes.set(aprobadas.length);
      },
      error: (err) => console.error('Error al obtener solicitudes:', err)
    });

    // 2. Cargar total de usuarios en el sistema
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`).subscribe({
      next: (data) => {
        this.totalUsuariosActivos.set(data.length);
        this.usuariosList.set(data);

        // Para saber cuántos son tutores, cargamos la lista de tutores autorizados
        this.http.get<any[]>(`${environment.apiUrl}/tutores-cursos`).subscribe({
          next: (tcs) => {
            // Contar tutores únicos en la tabla tutores_cursos
            const uniqueTutors = new Set(tcs.map(tc => tc.id_tutor));
            this.totalTutores.set(uniqueTutors.size);
          },
          error: (err) => console.error('Error al obtener tutores-cursos:', err)
        });
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });

    // 3. Cargar Cursos
    this.http.get<any[]>(`${environment.apiUrl}/cursos`).subscribe({
      next: (data) => {
        this.cursosList.set(data);
        this.totalCursos.set(data.length);
      },
      error: (err) => console.error('Error al obtener cursos:', err)
    });

    // 4. Cargar Carreras
    this.http.get<any[]>(`${environment.apiUrl}/carreras`).subscribe({
      next: (data) => {
        this.carrerasList.set(data);
        this.totalCarreras.set(data.length);
      },
      error: (err) => console.error('Error al obtener carreras:', err)
    });

    // 5. Cargar Asesorías para métricas avanzadas
    this.http.get<any[]>(`${environment.apiUrl}/asesorias`).subscribe({
      next: (data) => {
        this.totalAsesorias.set(data.length);
        const completadas = data.filter(a => a.estado === 'completada');
        this.asesoriasCompletadas.set(completadas.length);
      },
      error: (err) => console.error('Error al obtener asesorías:', err)
    });

    // 6. Cargar Valoraciones para métricas avanzadas (promedio)
    this.http.get<any[]>(`${environment.apiUrl}/valoraciones`).subscribe({
      next: (data) => {
        this.valoracionesList.set(data);
        if (data.length > 0) {
          const sum = data.reduce((acc, val) => acc + Number(val.puntuacion || 0), 0);
          const avg = sum / data.length;
          this.promedioCalificaciones.set(Number(avg.toFixed(1)));
        } else {
          this.promedioCalificaciones.set(0);
        }
      },
      error: (err) => console.error('Error al obtener valoraciones:', err)
    });

    this.cargarNotificaciones();
  }

  cambiarEstado(id: number, nuevoEstado: string): void {
    const actionWord = nuevoEstado === 'aprobada' ? 'aprobar' : 'rechazar';
    
    if (nuevoEstado === 'rechazada') {
      const motivo = window.prompt('Por favor, indica la razón del rechazo de esta solicitud:');
      if (motivo === null) return; // Cancelar
      
      this.http.put(`${environment.apiUrl}/solicitudes-tutor/${id}`, { 
        estado_solicitud: nuevoEstado,
        motivo_rechazo: motivo.trim() || 'No cumple con la nota mínima o requisitos.'
      }).subscribe({
        next: () => {
          this.cargarDatos();
          this.notificationService.showToast('Solicitud rechazada con éxito.', 'success');
        },
        error: (err) => {
          console.error('Error al rechazar solicitud:', err);
          this.notificationService.showToast('Error al rechazar la solicitud.', 'error');
        }
      });
      return;
    }

    this.notificationService.showConfirm({
      title: 'Confirmar Solicitud de Tutor',
      message: `¿Estás seguro de que deseas ${actionWord} esta solicitud de postulación?`,
      onConfirm: () => {
        this.http.put(`${environment.apiUrl}/solicitudes-tutor/${id}`, { estado_solicitud: nuevoEstado }).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast(`Solicitud aprobada con éxito.`, 'success');
          },
          error: (err) => {
            console.error('Error al actualizar solicitud:', err);
            this.notificationService.showToast('Error al actualizar el estado de la solicitud.', 'error');
          }
        });
      }
    });
  }

  tieneRol(user: any, id_rol: number): boolean {
    return user.roles && user.roles.some((r: any) => r.id_rol === id_rol);
  }

  agregarRolSeleccionado(id_usuario: number, event: any): void {
    const select = event.target as HTMLSelectElement;
    const id_rol = Number(select.value);
    if (!id_rol) return;

    const rolName = id_rol === 1 ? 'Alumno' : id_rol === 2 ? 'Tutor' : 'Moderador';

    this.notificationService.showConfirm({
      title: 'Asignar Nuevo Rol',
      message: `¿Estás seguro de que deseas asignar el rol de "${rolName}" a este usuario?`,
      onConfirm: () => {
        this.http.post(`${environment.apiUrl}/usuarios/${id_usuario}/roles`, { id_rol }).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Rol asignado exitosamente.', 'success');
          },
          error: (err) => {
            console.error('Error al asignar rol:', err);
            this.notificationService.showToast('Error al asignar el rol.', 'error');
          }
        });
      }
    });

    // Resetear el select inmediatamente para que no se quede seleccionada la opción
    select.value = '';
  }

  quitarRol(id_usuario: number, id_rol: number, nombre_rol: string): void {
    this.notificationService.showConfirm({
      title: 'Retirar Rol',
      message: `¿Estás seguro de que deseas retirar el rol de "${nombre_rol}" a este usuario?`,
      onConfirm: () => {
        this.http.delete(`${environment.apiUrl}/usuarios/${id_usuario}/roles/${id_rol}`).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Rol retirado exitosamente.', 'success');
          },
          error: (err) => {
            console.error('Error al retirar rol:', err);
            this.notificationService.showToast('Error al retirar el rol.', 'error');
          }
        });
      }
    });
  }

  eliminarUsuario(id_usuario: number, nombres: string, apellidos: string): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id === id_usuario) {
      this.notificationService.showToast('No puedes eliminar tu propia cuenta.', 'error');
      return;
    }

    this.notificationService.showConfirm({
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que deseas eliminar permanentemente a ${nombres} ${apellidos} del sistema? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        this.http.delete(`${environment.apiUrl}/usuarios/${id_usuario}`).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Usuario eliminado exitosamente.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            this.notificationService.showToast('Error al eliminar el usuario.', 'error');
          }
        });
      }
    });
  }

  guardarConfiguracion(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!this.configNombres().trim() || !this.configApellidos().trim()) {
      this.notificationService.showToast('Nombres y apellidos no pueden estar vacíos.', 'error');
      return;
    }

    const payload = {
      nombres: this.configNombres().trim(),
      apellidos: this.configApellidos().trim()
    };

    this.http.put<any>(`${environment.apiUrl}/usuarios/${user.id}`, payload).subscribe({
      next: (res) => {
        this.authService.updateCurrentUser({ nombres: res.nombres, apellidos: res.apellidos });
        this.notificationService.showToast('Perfil actualizado correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al guardar configuración:', err);
        this.notificationService.showToast('Error al actualizar el perfil.', 'error');
      }
    });
  }

  restablecerPasswordConfig(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.notificationService.showConfirm({
      title: 'Restablecer Contraseña',
      message: '¿Estás seguro de que deseas enviar un correo para restablecer tu contraseña?',
      onConfirm: () => {
        sendPasswordResetEmail(auth, user.correo).then(() => {
          this.notificationService.showToast('Enlace de recuperación enviado a tu correo.', 'success');
        }).catch((err: any) => {
          console.error('Error al enviar password reset:', err);
          this.notificationService.showToast('Error al enviar el correo de recuperación.', 'error');
        });
      }
    });
  }

  // CRUD de Carreras
  guardarCarrera(): void {
    if (!this.carreraFormNombre().trim() || !this.carreraFormFacultad().trim()) {
      this.notificationService.showToast('El nombre de la carrera y facultad son obligatorios.', 'error');
      return;
    }

    const payload = {
      nombre_carrera: this.carreraFormNombre().trim(),
      facultad: this.carreraFormFacultad().trim()
    };

    const editId = this.editCarreraId();
    if (editId) {
      this.http.put(`${environment.apiUrl}/carreras/${editId}`, payload).subscribe({
        next: () => {
          this.cargarDatos();
          this.notificationService.showToast('Carrera actualizada exitosamente.', 'success');
          this.resetCarreraForm();
        },
        error: (err) => {
          console.error('Error al actualizar carrera:', err);
          this.notificationService.showToast('Error al actualizar carrera.', 'error');
        }
      });
    } else {
      this.http.post(`${environment.apiUrl}/carreras`, payload).subscribe({
        next: () => {
          this.cargarDatos();
          this.notificationService.showToast('Carrera creada exitosamente.', 'success');
          this.resetCarreraForm();
        },
        error: (err) => {
          console.error('Error al crear carrera:', err);
          this.notificationService.showToast('Error al crear carrera.', 'error');
        }
      });
    }
  }

  editarCarrera(carrera: any): void {
    this.editCarreraId.set(carrera.id_carrera);
    this.carreraFormNombre.set(carrera.nombre_carrera);
    this.carreraFormFacultad.set(carrera.facultad);
  }

  eliminarCarrera(id: number): void {
    this.notificationService.showConfirm({
      title: 'Eliminar Carrera',
      message: '¿Estás seguro de que deseas eliminar esta carrera? Esta acción no se puede deshacer.',
      onConfirm: () => {
        this.http.delete(`${environment.apiUrl}/carreras/${id}`).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Carrera eliminada exitosamente.', 'success');
            if (this.editCarreraId() === id) {
              this.resetCarreraForm();
            }
          },
          error: (err: any) => {
            console.error('Error al eliminar carrera:', err);
            const msg = err.error?.error || 'Error al eliminar carrera.';
            this.notificationService.showToast(msg, 'error');
          }
        });
      }
    });
  }

  resetCarreraForm(): void {
    this.editCarreraId.set(null);
    this.carreraFormNombre.set('');
    this.carreraFormFacultad.set('');
  }

  // CRUD de Cursos
  guardarCurso(): void {
    if (!this.cursoFormNombre().trim() || !this.cursoFormCarrera()) {
      this.notificationService.showToast('El nombre del curso y la carrera son obligatorios.', 'error');
      return;
    }

    const payload = {
      nombre_curso: this.cursoFormNombre().trim(),
      id_carrera: Number(this.cursoFormCarrera()),
      ciclo: Number(this.cursoFormCiclo())
    };

    const editId = this.editCursoId();
    if (editId) {
      this.http.put(`${environment.apiUrl}/cursos/${editId}`, payload).subscribe({
        next: () => {
          this.cargarDatos();
          this.notificationService.showToast('Curso actualizado exitosamente.', 'success');
          this.resetCursoForm();
        },
        error: (err) => {
          console.error('Error al actualizar curso:', err);
          this.notificationService.showToast('Error al actualizar curso.', 'error');
        }
      });
    } else {
      this.http.post(`${environment.apiUrl}/cursos`, payload).subscribe({
        next: () => {
          this.cargarDatos();
          this.notificationService.showToast('Curso creado exitosamente.', 'success');
          this.resetCursoForm();
        },
        error: (err) => {
          console.error('Error al crear curso:', err);
          this.notificationService.showToast('Error al crear curso.', 'error');
        }
      });
    }
  }

  editarCurso(curso: any): void {
    this.editCursoId.set(curso.id_curso);
    this.cursoFormNombre.set(curso.nombre_curso);
    this.cursoFormCarrera.set(curso.id_carrera);
    this.cursoFormCiclo.set(curso.ciclo);
  }

  eliminarCurso(id: number): void {
    this.notificationService.showConfirm({
      title: 'Eliminar Curso',
      message: '¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.',
      onConfirm: () => {
        this.http.delete(`${environment.apiUrl}/cursos/${id}`).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Curso eliminado exitosamente.', 'success');
            if (this.editCursoId() === id) {
              this.resetCursoForm();
            }
          },
          error: (err: any) => {
            console.error('Error al eliminar curso:', err);
            const msg = err.error?.error || 'Error al eliminar curso.';
            this.notificationService.showToast(msg, 'error');
          }
        });
      }
    });
  }

  resetCursoForm(): void {
    this.editCursoId.set(null);
    this.cursoFormNombre.set('');
    this.cursoFormCarrera.set(null);
    this.cursoFormCiclo.set(1);
  }

  logout(): void {
    this.authService.logout();
  }
}
