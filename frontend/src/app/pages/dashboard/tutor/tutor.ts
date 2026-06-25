import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { NotificationService } from '../../../services/notification.service';
import { timer, of, forkJoin, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { FirebaseService } from '../../../services/firebase.service';
import { CURRICULUM_CONFIG } from '../../../config/curriculum.config';

interface Asesoria {
  id_asesoria: number;
  fecha_programada: string;
  estado: string;
  enlace_reunion?: string;
  alumno_nombres: string;
  alumno_apellidos: string;
  nombre_curso: string;
  motivo?: string;
  id_alumno: number;
}

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutor.html',
  styleUrl: '../student/student.scss'
})
export class TutorDashboardComponent implements OnInit, OnDestroy {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly firebaseService = inject(FirebaseService);
  private chatSubscription?: Subscription;
  private notificationSubscription?: Subscription;

  // Tab activo de Sidebar (SPA)
  activeTab = signal<string>('principal');
  sidebarCollapsed = signal(false);
  cicloAcademicoActivo = signal<string>(CURRICULUM_CONFIG.getActiveAcademicCycleString());

  asesorias = signal<Asesoria[]>([]);
  sesionesEsteMes = signal<number>(0);
  horasDictadas = signal<number>(0);
  promedioValoracion = signal<number>(5.0);
  evaluacionesCount = signal<number>(0);
  solicitudesEntrantes = signal<Asesoria[]>([]);
  horarios = signal<any[]>([]);

  // Saber si el tutor también es alumno (tiene rol alumno)
  esAlumno = computed(() => this.authService.userRoles().some(r => r.nombre_rol === 'alumno'));

  // Para registrar nuevo horario
  nuevoDia = signal<string>('lunes');
  nuevaHoraInicio = signal<string>('08:00');
  nuevaHoraFin = signal<string>('10:00');

  // Lógica de búsqueda
  searchQuery = signal<string>('');

  filteredSesionesProgramadas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.sesionesProgramadas();
    if (!query) return list;
    return list.filter(s =>
      s.alumno_nombres.toLowerCase().includes(query) ||
      s.alumno_apellidos.toLowerCase().includes(query) ||
      s.nombre_curso.toLowerCase().includes(query)
    );
  });

  filteredSolicitudesEntrantes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.solicitudesEntrantes();
    if (!query) return list;
    return list.filter(s =>
      s.alumno_nombres.toLowerCase().includes(query) ||
      s.alumno_apellidos.toLowerCase().includes(query) ||
      s.nombre_curso.toLowerCase().includes(query)
    );
  });

  filteredCursosHabilitados = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.cursosHabilitados();
    if (!query) return list;
    return list.filter(c =>
      c.nombre_curso.toLowerCase().includes(query) ||
      (c.nombre_carrera && c.nombre_carrera.toLowerCase().includes(query))
    );
  });

  filteredAsesorias = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.asesorias();
    if (!query) return list;
    return list.filter(a =>
      a.alumno_nombres.toLowerCase().includes(query) ||
      a.alumno_apellidos.toLowerCase().includes(query) ||
      a.nombre_curso.toLowerCase().includes(query)
    );
  });

  filteredRecursos = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.recursos();
    if (!query) return list;
    return list.filter(r =>
      r.titulo.toLowerCase().includes(query) ||
      r.nombre_curso.toLowerCase().includes(query)
    );
  });

  // Recursos Académicos
  recursos = signal<any[]>([]);
  cursosTutor = signal<any[]>([]);
  nuevoTituloRecurso = signal<string>('');
  nuevoIdCursoRecurso = signal<number>(0);
  nuevoUrlRecurso = signal<string>('');
  configNombres = signal('');
  configApellidos = signal('');
  
  // Gestión de cursos propios autorizados y dictados
  solicitudesAprobadas = signal<any[]>([]);
  cursosHabilitados = signal<any[]>([]);
  cursosHabilitarSelect = signal<number>(0);
  
  cursosDisponiblesParaHabilitar = computed(() => {
    const habilitadosIds = new Set(this.cursosHabilitados().map(c => c.id_curso));
    return this.solicitudesAprobadas().filter(s => !habilitadosIds.has(s.id_curso));
  });

  // Chat / Mensajes
  mensajesChat = signal<any[]>([]);
  conversaciones = signal<any[]>([]);
  idAlumnoChatSeleccionado = signal<number>(6); // Alumno mock por defecto (id=6)
  nuevoMensajeTexto = signal<string>('');

  mensajesSinLeerTotal = computed(() => {
    return this.conversaciones().reduce((acc, conv) => acc + (conv.mensajes_sin_leer || 0), 0);
  });

  sesionesProgramadas = computed(() => {
    return this.asesorias().filter(a => a.estado === 'confirmada');
  });

  // Para ver detalle de alumno
  mostrarModalDetalleAlumno = signal<boolean>(false);
  alumnoDetalle = signal<any | null>(null);
  historialAsesoriasAlumno = signal<Asesoria[]>([]);
  cursosAprobadosAlumnoNames = signal<string[]>([]);

  abrirDetalleAlumno(idAlumno: number): void {
    if (!idAlumno) return;
    this.http.get<any>(`${environment.apiUrl}/usuarios/${idAlumno}`).subscribe({
      next: (userObj) => {
        this.alumnoDetalle.set(userObj);
        
        // Resolver nombres de cursos aprobados
        const passedIds = userObj.cursos_aprobados || [];
        const resolvedNames: string[] = [];
        for (const id of passedIds) {
          const course = this.cursosTutor().find(c => c.id_curso === id);
          if (course) {
            resolvedNames.push(course.nombre_curso);
          } else {
            resolvedNames.push(`Curso #${id}`);
          }
        }
        this.cursosAprobadosAlumnoNames.set(resolvedNames);
        
        // Filtrar historial de asesorías
        const history = this.asesorias().filter(a => a.id_alumno === idAlumno);
        this.historialAsesoriasAlumno.set(history);
        
        this.mostrarModalDetalleAlumno.set(true);
      },
      error: (err) => {
        console.error('Error al obtener detalle de alumno:', err);
        this.notificationService.showToast('Error al obtener información del alumno.', 'error');
      }
    });
  }

  iniciarChatConAlumno(idAlumno: number): void {
    this.mostrarModalDetalleAlumno.set(false);
    this.idAlumnoChatSeleccionado.set(idAlumno);
    this.activeTab.set('mensajes');
    this.cargarMensajería();
  }

  guardarEnlaceMeet(asesoria: Asesoria): void {
    const url = asesoria.enlace_reunion?.trim();
    if (!url) {
      this.notificationService.showToast('Por favor ingrese un enlace válido.', 'error');
      return;
    }
    
    this.http.put(`${environment.apiUrl}/asesorias/${asesoria.id_asesoria}`, { enlace_reunion: url }).subscribe({
      next: () => {
        this.notificationService.showToast('Enlace de reunión actualizado.', 'success');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al guardar enlace de Meet:', err);
        this.notificationService.showToast('Error al guardar el enlace.', 'error');
      }
    });
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
    this.http.get<any[]>(`${environment.apiUrl}/notificaciones/usuario/${user.id}?rol=tutor`).subscribe({
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
        switchMap(() => this.http.get<any[]>(`${environment.apiUrl}/notificaciones/usuario/${user.id}?rol=tutor`).pipe(
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
    if (msg.includes('postulación') || msg.includes('aprobada')) {
      this.activeTab.set('cursos');
    } else if (msg.includes('asesoría') || msg.includes('cita') || msg.includes('solicitud')) {
      this.activeTab.set('principal');
    } else if (msg.includes('calificado') || msg.includes('estrella') || msg.includes('valoración')) {
      this.activeTab.set('valoraciones');
    } else if (msg.includes('mensaje') || msg.includes('chatear') || msg.includes('escribió')) {
      this.activeTab.set('mensajes');
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
    this.startChatPolling();
    this.startNotificationPolling();
  }

  ngOnDestroy(): void {
    this.destroyChatPolling();
    this.destroyNotificationPolling();
  }

  cargarDatos(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.configNombres.set(user.nombres);
    this.configApellidos.set(user.apellidos);

    // Obtener asesorías del tutor
    this.http.get<Asesoria[]>(`${environment.apiUrl}/asesorias/tutor/${user.id}`).subscribe({
      next: (data) => {
        this.asesorias.set(data);

        // Calcular sesiones completadas
        const completadas = data.filter(a => a.estado === 'completada');
        this.sesionesEsteMes.set(completadas.length);
        
        // Calcular horas dictadas (1.5 horas por sesión completada)
        this.horasDictadas.set(completadas.length * 1.5);

        // Filtrar solicitudes entrantes (estado pendiente)
        const pendientes = data.filter(a => a.estado === 'pendiente');
        this.solicitudesEntrantes.set(pendientes);

        // Obtener valoraciones reales para calcular el promedio
        this.http.get<any[]>(`${environment.apiUrl}/valoraciones`).subscribe({
          next: (vals) => {
            const tutorAsesoriaIds = new Set(data.map(a => a.id_asesoria));
            const tutorVals = vals.filter(v => tutorAsesoriaIds.has(v.id_asesoria));
            if (tutorVals.length > 0) {
              const sum = tutorVals.reduce((acc, v) => acc + v.puntuacion, 0);
              const avg = sum / tutorVals.length;
              this.promedioValoracion.set(Math.round(avg * 10) / 10);
              this.evaluacionesCount.set(tutorVals.length);
            } else {
              this.promedioValoracion.set(5.0);
              this.evaluacionesCount.set(0);
            }
          },
          error: (err) => console.error('Error al cargar valoraciones:', err)
        });
      },
      error: (err) => console.error('Error al cargar asesorías:', err)
    });

    // Cargar disponibilidad horaria real del tutor
    this.http.get<any[]>(`${environment.apiUrl}/horarios-tutor/tutor/${user.id}`).subscribe({
      next: (data) => this.horarios.set(data),
      error: (err) => console.error('Error al cargar disponibilidad:', err)
    });

    // Cargar recursos académicos de la base de datos
    this.http.get<any[]>(`${environment.apiUrl}/recursos`).subscribe({
      next: (data) => {
        const tutorRecs = data.filter(r => r.id_tutor === user.id);
        this.recursos.set(tutorRecs);
      },
      error: (err) => console.error('Error al cargar recursos:', err)
    });

    // Cargar catálogo de cursos para habilitar subida
    const carreraId = user.id_carrera || 1;
    this.http.get<any[]>(`${environment.apiUrl}/cursos?id_carrera=${carreraId}`).subscribe({
      next: (data) => this.cursosTutor.set(data),
      error: (err) => console.error('Error al cargar cursos:', err)
    });

    // Cargar solicitudes aprobadas del tutor (acreditación)
    this.http.get<any[]>(`${environment.apiUrl}/solicitudes-tutor/usuario/${user.id}`).subscribe({
      next: (data) => {
        const aprobadas = data.filter(s => s.estado_solicitud === 'aprobada');
        this.solicitudesAprobadas.set(aprobadas);
      },
      error: (err) => console.error('Error al cargar solicitudes aprobadas:', err)
    });

    // Cargar cursos habilitados del tutor
    this.http.get<any[]>(`${environment.apiUrl}/tutores-cursos/tutor/${user.id}`).subscribe({
      next: (data) => this.cursosHabilitados.set(data),
      error: (err) => console.error('Error al cargar cursos habilitados:', err)
    });

    this.cargarNotificaciones();
  }

  cambiarEstadoAsesoria(idAsesoria: number, nuevoEstado: string): void {
    const actionWord = nuevoEstado === 'confirmada' ? 'aceptar' : 'cancelar';
    this.notificationService.showConfirm({
      title: 'Confirmar Acción',
      message: `¿Estás seguro de que deseas ${actionWord} esta solicitud de asesoría?`,
      onConfirm: () => {
        this.http.put(`${environment.apiUrl}/asesorias/${idAsesoria}`, { estado: nuevoEstado }).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast(`Asesoría ${nuevoEstado} con éxito.`, 'success');
          },
          error: (err) => {
            console.error('Error al actualizar estado de asesoría:', err);
            this.notificationService.showToast('Error al actualizar el estado.', 'error');
          }
        });
      }
    });
  }

  registrarHorario(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.notificationService.showConfirm({
      title: 'Registrar Horario de Disponibilidad',
      message: `¿Deseas registrar tu horario de disponibilidad para los ${this.nuevoDia()} de ${this.nuevaHoraInicio()} a ${this.nuevaHoraFin()}?`,
      onConfirm: () => {
        const payload = {
          id_tutor: user.id,
          dia_semana: this.nuevoDia(),
          hora_inicio: this.nuevaHoraInicio(),
          hora_fin: this.nuevaHoraFin()
        };

        this.http.post(`${environment.apiUrl}/horarios-tutor`, payload).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Horario de disponibilidad registrado.', 'success');
          },
          error: (err) => {
            console.error('Error al registrar horario:', err);
            this.notificationService.showToast('Error al registrar horario.', 'error');
          }
        });
      }
    });
  }

  eliminarHorario(idHorario: number): void {
    this.notificationService.showConfirm({
      title: 'Eliminar Horario',
      message: '¿Estás seguro de que deseas eliminar este horario de disponibilidad?',
      onConfirm: () => {
        this.http.delete(`${environment.apiUrl}/horarios-tutor/${idHorario}`).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Horario eliminado de la base de datos.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar horario:', err);
            this.notificationService.showToast('Error al eliminar el horario.', 'error');
          }
        });
      }
    });
  }

  getSlotsForDay(dia: string): any[] {
    // Normalizar día
    const diaNorm = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return this.horarios().filter(h => {
      const hDiaNorm = h.dia_semana.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return hDiaNorm === diaNorm;
    });
  }

  cambiarAPanelAlumno(): void {
    this.router.navigate(['/dashboard']);
  }

  // ponytail: implement reactive polling using RxJS timer & switchMap to auto-sync chat messages
  startChatPolling(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.destroyChatPolling();

    this.chatSubscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          const alumnoId = this.idAlumnoChatSeleccionado();
          if (!alumnoId) return of({ conversaciones: [], chat: [] });
          return forkJoin({
            conversaciones: this.http.get<any[]>(`${environment.apiUrl}/mensajes/conversaciones/${user.id}?rol=alumno`),
            chat: this.http.get<any[]>(`${environment.apiUrl}/mensajes/chat/${user.id}/${alumnoId}`)
          }).pipe(
            catchError((err) => {
              console.error('Error fetching chat data:', err);
              return of({ conversaciones: this.conversaciones(), chat: this.mensajesChat() });
            })
          );
        })
      )
      .subscribe({
        next: (result) => {
          this.conversaciones.set(result.conversaciones);
          this.mensajesChat.set(result.chat);
        }
      });
  }

  destroyChatPolling(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  seleccionarAlumnoChat(idAlumno: number): void {
    this.idAlumnoChatSeleccionado.set(idAlumno);
    this.startChatPolling();
  }

  cargarMensajería(): void {
    this.startChatPolling();
  }

  enviarMensajeChat(): void {
    const user = this.authService.currentUser();
    const texto = this.nuevoMensajeTexto().trim();
    if (!user || !texto) return;

    const payload = {
      id_emisor: user.id,
      id_receptor: this.idAlumnoChatSeleccionado(),
      contenido: texto
    };

    this.http.post(`${environment.apiUrl}/mensajes`, payload).subscribe({
      next: () => {
        this.nuevoMensajeTexto.set('');
        this.cargarMensajería();
        this.notificationService.showToast('Mensaje enviado.', 'success');
      },
      error: (err) => {
        console.error('Error al enviar mensaje:', err);
        this.notificationService.showToast('Error al enviar mensaje.', 'error');
      }
    });
  }

  selectedFileRecurso: File | null = null;
  nombreArchivoRecurso = signal<string>('');

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileRecurso = file;
      this.nombreArchivoRecurso.set(file.name);
    }
  }

  subirRecurso(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    const titulo = this.nuevoTituloRecurso().trim();
    const idCurso = Number(this.nuevoIdCursoRecurso());

    if (!titulo || !idCurso || !this.selectedFileRecurso) {
      this.notificationService.showToast('Por favor complete todos los campos y seleccione un archivo.', 'error');
      return;
    }

    this.notificationService.showConfirm({
      title: 'Subir Recurso Académico',
      message: '¿Estás seguro de que deseas publicar este recurso para tus alumnos?',
      onConfirm: () => {
        // Subir archivo a Firebase Storage via FirebaseService
        const path = `recursos/${Date.now()}_${this.selectedFileRecurso!.name}`;
        this.firebaseService.uploadFile(path, this.selectedFileRecurso!).then((url) => {
          const payload = {
            id_curso: idCurso,
            id_tutor: user.id,
            titulo,
            url_archivo: url
          };

          this.http.post(`${environment.apiUrl}/recursos`, payload).subscribe({
            next: () => {
              this.nuevoTituloRecurso.set('');
              this.nuevoIdCursoRecurso.set(0);
              this.selectedFileRecurso = null;
              this.nombreArchivoRecurso.set('');
              this.cargarDatos();
              this.notificationService.showToast('Recurso publicado con éxito.', 'success');
            },
            error: (err) => {
              console.error('Error al registrar recurso:', err);
              this.notificationService.showToast('Error al registrar el recurso en base de datos.', 'error');
            }
          });
        }).catch((err) => {
          console.error('Error al subir a Firebase Storage:', err);
          this.notificationService.showToast('Error al subir archivo a Firebase Storage.', 'error');
        });
      }
    });
  }

  eliminarRecurso(idRecurso: number): void {
    this.notificationService.showConfirm({
      title: 'Eliminar Recurso',
      message: '¿Estás seguro de que deseas eliminar este recurso académico?',
      onConfirm: () => {
        this.http.delete(`${environment.apiUrl}/recursos/${idRecurso}`).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Recurso eliminado de la base de datos.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar recurso:', err);
            this.notificationService.showToast('Error al eliminar el recurso.', 'error');
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
        this.firebaseService.sendPasswordReset(user.correo).then(() => {
          this.notificationService.showToast('Enlace de recuperación enviado a tu correo.', 'success');
        }).catch((err: any) => {
          console.error('Error al enviar password reset:', err);
          this.notificationService.showToast('Error al enviar el correo de recuperación.', 'error');
        });
      }
    });
  }

  habilitarCurso(idCurso: number): void {
    const user = this.authService.currentUser();
    if (!user || !idCurso) return;
    this.http.post(`${environment.apiUrl}/tutores-cursos`, { id_tutor: user.id, id_curso: Number(idCurso), estado_aprobacion: 'aprobado' }).subscribe({
      next: () => {
        this.cargarDatos();
        this.cursosHabilitarSelect.set(0);
        this.notificationService.showToast('Curso habilitado para brindar asesorías.', 'success');
      },
      error: (err) => {
        console.error('Error al habilitar curso:', err);
        this.notificationService.showToast(err.error?.error || 'Error al habilitar curso.', 'error');
      }
    });
  }

  deshabilitarCurso(idAutorizacion: number): void {
    this.notificationService.showConfirm({
      title: 'Deshabilitar Curso',
      message: '¿Estás seguro de que deseas dejar de brindar asesorías para este curso?',
      onConfirm: () => {
        this.http.delete(`${environment.apiUrl}/tutores-cursos/${idAutorizacion}`).subscribe({
          next: () => {
            this.cargarDatos();
            this.notificationService.showToast('Curso deshabilitado.', 'success');
          },
          error: (err) => {
            console.error('Error al deshabilitar curso:', err);
            this.notificationService.showToast('Error al deshabilitar curso.', 'error');
          }
        });
      }
    });
  }

  // Para postular como Tutor a nuevos cursos
  mostrarModalPostulacion = signal<boolean>(false);
  cursosSeleccionadosPostulacion = signal<number[]>([]);
  notasPostulacionMap = signal<Record<number, number>>({});
  nombreArchivoPostulacion = signal<string>('');
  selectedFilePostulacion: File | null = null;
  filtroCursoPostulacion = signal<string>('');
  fileDragOver = signal<boolean>(false);

  cursosTutorFiltrados = computed(() => {
    const query = this.filtroCursoPostulacion().toLowerCase().trim();
    if (!query) return this.cursosTutor();
    return this.cursosTutor().filter(c => c.nombre_curso.toLowerCase().includes(query));
  });

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileDragOver.set(false);
  }

  onDropFile(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileDragOver.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.selectedFilePostulacion = file;
      this.nombreArchivoPostulacion.set(file.name);
    }
  }

  onFileSelectedPostulacion(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFilePostulacion = file;
      this.nombreArchivoPostulacion.set(file.name);
    }
  }

  getNotaForCurso(idCurso: number): number {
    return this.notasPostulacionMap()[idCurso] ?? 18;
  }

  setNotaForCurso(idCurso: number, grade: number): void {
    this.notasPostulacionMap.update(map => ({
      ...map,
      [idCurso]: grade
    }));
  }

  toggleCursoPostulacion(idCurso: number): void {
    const current = this.cursosSeleccionadosPostulacion();
    if (current.includes(idCurso)) {
      this.cursosSeleccionadosPostulacion.set(current.filter(id => id !== idCurso));
      this.notasPostulacionMap.update(map => {
        const copy = { ...map };
        delete copy[idCurso];
        return copy;
      });
    } else {
      this.cursosSeleccionadosPostulacion.set([...current, idCurso]);
      this.setNotaForCurso(idCurso, 18);
    }
  }

  enviarPostulacionTutor(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    if (this.cursosSeleccionadosPostulacion().length === 0 || !this.selectedFilePostulacion) {
      this.notificationService.showToast('Por favor complete todos los campos, seleccione al menos un curso y adjunte su constancia.', 'error');
      return;
    }

    this.notificationService.showConfirm({
      title: 'Confirmar Postulación de Curso',
      message: `¿Estás seguro de que deseas postularte para ser tutor de los ${this.cursosSeleccionadosPostulacion().length} cursos seleccionados?`,
      onConfirm: () => {
        // Subir archivo a Firebase Storage via FirebaseService
        const path = `boletas/${Date.now()}_${this.selectedFilePostulacion!.name}`;
        this.firebaseService.uploadFile(path, this.selectedFilePostulacion!).then((url) => {
          const courses = this.cursosSeleccionadosPostulacion();
          let errors = 0;

          // ponytail: use forkJoin to submit all postulations in parallel cleanly
          const requests = courses.map(id_curso => {
            const payload = {
              id_usuario: user.id,
              id_curso: Number(id_curso),
              nota_obtenida: this.getNotaForCurso(id_curso),
              url_boleta_notas: url
            };
            return this.http.post(`${environment.apiUrl}/solicitudes-tutor`, payload).pipe(
              catchError((err) => {
                console.error('Error al enviar postulación:', err);
                errors++;
                return of(null);
              })
            );
          });

          forkJoin(requests).subscribe({
            next: () => {
              this.onPostulacionFinished(errors);
            }
          });
        }).catch((err) => {
          console.error('Error al subir a Firebase Storage:', err);
          this.notificationService.showToast('Error al subir archivo a Firebase Storage.', 'error');
        });
      }
    });
  }

  private onPostulacionFinished(errorsCount: number): void {
    this.mostrarModalPostulacion.set(false);
    this.selectedFilePostulacion = null;
    this.nombreArchivoPostulacion.set('');
    this.cursosSeleccionadosPostulacion.set([]);
    
    if (errorsCount > 0) {
      this.notificationService.showToast('Se enviaron las postulaciones, pero algunas fallaron.', 'error');
    } else {
      this.notificationService.showToast('¡Todas las postulaciones han sido enviadas exitosamente!', 'success');
      this.cargarDatos(); // Recargar datos
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
