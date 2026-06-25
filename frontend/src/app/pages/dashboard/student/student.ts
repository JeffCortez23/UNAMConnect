import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
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


import { environment } from '../../../../environments/environment';
import { Asesoria, Curso } from '../../../models';

import { StudentStatsComponent } from './components/student-stats';
import { StudentTutorsComponent } from './components/student-tutors';
import { StudentAdvisoriesComponent } from './components/student-advisories';
import { StudentCoursesComponent } from './components/student-courses';
import { StudentStatsTabComponent } from './components/student-stats-tab';
import { StudentChatComponent } from './components/student-chat';
import { StudentProfileComponent } from './components/student-profile';

interface Tutor {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    StudentStatsComponent,
    StudentTutorsComponent,
    StudentAdvisoriesComponent,
    StudentCoursesComponent,
    StudentStatsTabComponent,
    StudentChatComponent,
    StudentProfileComponent
  ],
  templateUrl: './student.html',
  styleUrl: './student.scss'
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly firebaseService = inject(FirebaseService);
  private chatSubscription?: Subscription;

  // Tab activo del Sidebar (SPA)
  activeTab = signal<string>('principal');
  sidebarCollapsed = signal(false);

  asesorias = signal<Asesoria[]>([]);
  todosLosCursos = signal<Curso[]>([]);
  cicloActualEstudiante = signal<number>(10);
  cicloAcademicoActivo = signal<string>(CURRICULUM_CONFIG.getActiveAcademicCycleString());
  
  // Señal de búsqueda
  searchQuery = signal<string>('');

  cursos = computed(() => {
    return this.todosLosCursos().filter(c => c.ciclo <= this.cicloActualEstudiante());
  });

  filteredTutores = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.tutores();
    if (!query) return list;
    return list.filter(u =>
      u.nombres.toLowerCase().includes(query) ||
      u.apellidos.toLowerCase().includes(query) ||
      u.correo.toLowerCase().includes(query)
    );
  });

  filteredAsesorias = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.asesorias();
    if (!query) return list;
    return list.filter(a =>
      (a.tutor_nombres && a.tutor_nombres.toLowerCase().includes(query)) ||
      (a.tutor_apellidos && a.tutor_apellidos.toLowerCase().includes(query)) ||
      (a.nombre_curso && a.nombre_curso.toLowerCase().includes(query))
    );
  });

  activeAsesoriasCount = computed(() => {
    return this.asesorias().filter(a => a.estado === 'confirmada' || a.estado === 'pendiente').length;
  });

  asesoriasDeHoy = computed(() => {
    const todayStr = new Date().toDateString();
    return this.asesorias()
      .filter(a => a.fecha_programada && new Date(a.fecha_programada).toDateString() === todayStr)
      .sort((a, b) => new Date(a.fecha_programada).getTime() - new Date(b.fecha_programada).getTime());
  });

  filteredCiclosConCursos = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.cursos().filter(c => !query || c.nombre_curso.toLowerCase().includes(query));

    const grouped: { [key: number]: Curso[] } = {};
    for (const curso of list) {
      if (!grouped[curso.ciclo]) {
        grouped[curso.ciclo] = [];
      }
      grouped[curso.ciclo].push(curso);
    }
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return Object.keys(grouped)
      .map(k => Number(k))
      .sort((a, b) => a - b)
      .map(ciclo => ({
        ciclo,
        nombreCiclo: numerals[ciclo - 1] || ciclo.toString(),
        cursos: grouped[ciclo]
      }));
  });

  ciclosConCursos = computed(() => {
    const grouped: { [key: number]: Curso[] } = {};
    for (const curso of this.cursos()) {
      if (!grouped[curso.ciclo]) {
        grouped[curso.ciclo] = [];
      }
      grouped[curso.ciclo].push(curso);
    }
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return Object.keys(grouped)
      .map(k => Number(k))
      .sort((a, b) => a - b)
      .map(ciclo => ({
        ciclo,
        nombreCiclo: numerals[ciclo - 1] || ciclo.toString(),
        cursos: grouped[ciclo]
      }));
  });
  todosLosTutores = signal<Tutor[]>([]);
  tutoresCursosMap = signal<any[]>([]);
  tutores = computed(() => {
    const availableCourses = this.cursos().filter(c => !this.isCursoAprobado(c.id_curso) && !this.isCursoBloqueado(c));
    const studentAvailableCourseIds = new Set(availableCourses.map(c => c.id_curso));
    const user = this.authService.currentUser();
    if (!user) return [];

    return this.todosLosTutores().filter(u => {
      const tutorCourses = this.tutoresCursosMap().filter(tc => tc.id_tutor === u.id_usuario);
      const hasSharedCourse = tutorCourses.some(tc => studentAvailableCourseIds.has(tc.id_curso));
      return hasSharedCourse && u.id_usuario !== user.id;
    });
  });
  cursosFiltradosModal = computed(() => {
    const tutorId = Number(this.nuevoIdTutor());
    const studentAvailable = this.cursos().filter(c => !this.isCursoAprobado(c.id_curso) && !this.isCursoBloqueado(c));
    if (!tutorId) {
      return studentAvailable;
    }
    const tcIds = new Set(
      this.tutoresCursosMap()
        .filter(tc => tc.id_tutor === tutorId)
        .map(tc => tc.id_curso)
    );
    return studentAvailable.filter(c => tcIds.has(c.id_curso));
  });

  tutorHorariosDisponibles = signal<any[]>([]);
  fechasDisponibles = signal<{ label: string, value: string }[]>([]);
  nuevoHorarioSeleccionadoId = signal<number>(0);

  cargarHorariosTutor(idTutor: number): void {
    const tutorId = Number(idTutor);
    if (!tutorId) {
      this.tutorHorariosDisponibles.set([]);
      this.fechasDisponibles.set([]);
      this.nuevoHorarioSeleccionadoId.set(0);
      return;
    }
    this.http.get<any[]>(`${environment.apiUrl}/horarios-tutor/tutor/${tutorId}`).subscribe({
      next: (slots) => {
        this.tutorHorariosDisponibles.set(slots);
        this.nuevoHorarioSeleccionadoId.set(0);
        this.fechasDisponibles.set([]);
      },
      error: (err) => {
        console.error('Error al obtener horarios del tutor:', err);
        this.tutorHorariosDisponibles.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.startChatPolling();
  }

  onTutorSelected(id: any): void {
    const tutorId = Number(id);
    this.nuevoIdTutor.set(tutorId);
    this.cargarHorariosTutor(tutorId);
  }

  onHorarioSlotChange(idHorarioStr: any): void {
    const idHorario = Number(idHorarioStr);
    this.nuevoHorarioSeleccionadoId.set(idHorario);
    if (!idHorario) {
      this.fechasDisponibles.set([]);
      this.nuevaFecha.set('');
      this.nuevaHora.set('');
      return;
    }

    const slot = this.tutorHorariosDisponibles().find(h => h.id_horario === idHorario);
    if (!slot) return;

    this.nuevaHora.set(slot.hora_inicio);

    const daysMap: Record<string, number> = {
      'domingo': 0, 'lunes': 1, 'martes': 2, 'miercoles': 3, 'jueves': 4, 'viernes': 5, 'sabado': 6
    };

    const diaNorm = slot.dia_semana.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const targetDay = daysMap[diaNorm];
    if (targetDay === undefined) return;

    const list: { label: string, value: string }[] = [];
    const today = new Date();
    let count = 0;
    let offset = 0;

    while (count < 4 && offset < 35) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + offset);

      if (nextDate.getDay() === targetDay) {
        const yyyy = nextDate.getFullYear();
        const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
        const dd = String(nextDate.getDate()).padStart(2, '0');
        const dateVal = `${yyyy}-${mm}-${dd}`;

        const label = nextDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        if (CURRICULUM_CONFIG.isAcademicSemesterActive(nextDate)) {
          list.push({ label, value: dateVal });
          count++;
        }
      }
      offset++;
    }
    
    this.fechasDisponibles.set(list);
    if (list.length > 0) {
      this.nuevaFecha.set(list[0].value);
    } else {
      this.nuevaFecha.set('');
    }
  }
  // Saber si el alumno tiene asignado el rol de tutor en la BD
  esTutor = computed(() => this.authService.userRoles().some(r => r.nombre_rol === 'tutor'));

  totalPendientes = computed(() => this.asesorias().filter(a => a.estado === 'pendiente').length);
  totalConfirmadas = computed(() => this.asesorias().filter(a => a.estado === 'confirmada').length);
  totalCanceladas = computed(() => this.asesorias().filter(a => a.estado === 'cancelada' || a.estado === 'rechazada').length);

  // Métricas dinámicas
  totalCompletadas = signal<number>(0);
  horasAcumuladas = signal<number>(0);
  notaPromedio = signal<number>(0);
  tutoresActivos = signal<number>(0);
  proximaCitaText = signal<string>('Sin citas hoy');
  proximaCitaHora = signal<string>('--:--');
  notificacionesList = signal<any[]>([]);
  notificationsOpen = signal<boolean>(false);
  unreadNotificationsCount = computed(() => this.notificacionesList().filter(n => !n.leido).length);
  isDashboardLoading = signal<boolean>(true);

  // Valoraciones / Reseñas de asesorías completadas
  valoracionesList = signal<any[]>([]);
  mostrarModalValorar = signal<boolean>(false);
  asesoriaAValorar = signal<Asesoria | null>(null);
  puntuacionValoracion = signal<number>(5);
  comentarioValoracion = signal<string>('');

  haSidoValorada(idAsesoria: number): boolean {
    return this.valoracionesList().some(v => v.id_asesoria === idAsesoria);
  }

  abrirModalValorar(asesoria: Asesoria): void {
    this.asesoriaAValorar.set(asesoria);
    this.puntuacionValoracion.set(5);
    this.comentarioValoracion.set('');
    this.mostrarModalValorar.set(true);
  }

  enviarValoracion(): void {
    const asesoria = this.asesoriaAValorar();
    if (!asesoria) return;
    
    const payload = {
      id_asesoria: asesoria.id_asesoria,
      puntuacion: this.puntuacionValoracion(),
      comentario: this.comentarioValoracion().trim()
    };

    this.http.post(`${environment.apiUrl}/valoraciones`, payload).subscribe({
      next: () => {
        this.mostrarModalValorar.set(false);
        this.notificationService.showToast('¡Muchas gracias por tu valoración!', 'success');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al enviar valoración:', err);
        this.notificationService.showToast('Error al registrar la valoración.', 'error');
      }
    });
  }

  // Para solicitar nueva asesoría
  mostrarModalSolicitar = signal<boolean>(false);
  nuevoIdTutor = signal<number>(0);
  nuevoIdCurso = signal<number>(0);
  nuevaFecha = signal<string>('');
  nuevaHora = signal<string>('');
  nuevoMotivo = signal<string>('');

  // Para postular como Tutor
  mostrarModalPostulacion = signal<boolean>(false);
  cursosSeleccionadosPostulacion = signal<number[]>([]);
  notasPostulacionMap = signal<Record<number, number>>({});
  urlBoleta = signal<string>('https://unam.edu.pe/boleta_notas.pdf');
  nombreArchivoPostulacion = signal<string>('');
  configNombres = signal('');
  configApellidos = signal('');
  configCicloActual = signal<number>(10);
  configCursosAprobados = signal<number[]>([]);
  
  configCursosPrevios = computed(() => {
    const ciclo = Number(this.configCicloActual());
    if (!ciclo || ciclo <= 1) return [];
    return this.todosLosCursos().filter(c => c.ciclo < ciclo);
  });

  toggleConfigCursoAprobado(id: number): void {
    const current = this.configCursosAprobados();
    if (current.includes(id)) {
      this.configCursosAprobados.set(current.filter(x => x !== id));
    } else {
      this.configCursosAprobados.set([...current, id]);
    }
  }

  filtroCursoPostulacion = signal<string>('');
  fileDragOver = signal<boolean>(false);

  cursosTutorFiltrados = computed(() => {
    const query = this.filtroCursoPostulacion().toLowerCase().trim();
    if (!query) return this.cursos();
    return this.cursos().filter(c => c.nombre_curso.toLowerCase().includes(query));
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

  isCursoAprobado(idCurso: number): boolean {
    const passedIds = this.authService.currentUser()?.cursos_aprobados || [];
    return passedIds.includes(idCurso);
  }

  isCursoBloqueado(c: Curso): boolean {
    if (this.isCursoAprobado(c.id_curso)) return false;

    const name = c.nombre_curso.trim();
    
    const PREREQUISITES_MAP: Record<string, string[]> = {
      'Estructura de Datos': ['Fundamentos de Programacion'],
      'Programacion Orientada a Objetos I': ['Fundamentos de Programacion'],
      'Algebra Lineal': ['Matematica I'],
      'Matematica II': ['Matematica I'],
      'Analisis y Diseño de Algoritmos': ['Estructura de Datos'],
      'Programacion Orientada a Objetos II': ['Programacion Orientada a Objetos I'],
      'Matematica III': ['Matematica II'],
      'Matematicas Discretas II': ['Matematicas Discretas I'],
      'Probabilidades': ['Algebra Lineal', 'Matematica II'],
      'Algoritmos Paralelos': ['Analisis y Diseño de Algoritmos'],
      'Sistemas Distribuidos': ['Algoritmos Paralelos'],
      'Analisis y Diseño de Sistemas II': ['Analisis y Diseño de Sistemas I'],
      'Base de Datos II': ['Base de Datos I'],
      'Metodos Numericos': ['Matematica IV'],
      'Sistemas Digitales': ['Circuitos Electricos y Electronicos'],
      'Investigacion Operativa II': ['Investigacion Operativa I'],
      'Ingenieria de Software': ['Analisis y Diseño de Sistemas II', 'Base de Datos II'],
      'Business Intelligence': ['Base de Datos II'],
      'Aplicaciones Web II': ['Aplicaciones Web I'],
      'Arquitectura de Computadoras': ['Sistemas Digitales'],
      'Calidad de Software': ['Ingenieria de Software'],
      'Programacion de Dispositivos Moviles II': ['Programacion de Dispositivos Moviles I'],
      'Lenguaje de Bajo Nivel': ['Arquitectura de Computadoras'],
      'Cloud Computing': ['Data Mining'],
      'Programacion de Video Juegos II': ['Programacion de Video Juegos I'],
      'Redes II': ['Redes I'],
      'Inteligencia Artificial I': ['Procesamiento de Imagenes y Videos'],
      'Proyecto de Investigacion II': ['Proyecto de Investigacion I'],
      'Robotica II': ['Robotica I'],
      'Inteligencia Artificial II': ['Inteligencia Artificial I'],
      'Auditoria de Sistemas de Informacion': ['Seguridad Informatica'],
      'Seguridad de la Informacion': ['Seguridad Informatica'],
      'Seminario de Tesis': ['Proyecto de Investigacion II'],
      'Gestion de Proyectos II': ['Gestion de Proyectos I'],
      'Trabajo de Investigación': ['Proyecto de Investigacion II']
    };

    const prereqs = PREREQUISITES_MAP[name];
    if (!prereqs) return false;

    const passedIds = this.authService.currentUser()?.cursos_aprobados || [];
    const passedNames = new Set(
      this.todosLosCursos()
        .filter(x => passedIds.includes(x.id_curso))
        .map(x => x.nombre_curso.trim().toLowerCase())
    );

    for (const pr of prereqs) {
      const prereqCourse = this.todosLosCursos().find(x => x.nombre_curso.trim().toLowerCase() === pr.toLowerCase());
      if (prereqCourse) {
        if (!passedNames.has(pr.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }

  getPrerequisitosFaltantes(c: Curso): string[] {
    const name = c.nombre_curso.trim();
    const PREREQUISITES_MAP: Record<string, string[]> = {
      'Estructura de Datos': ['Fundamentos de Programacion'],
      'Programacion Orientada a Objetos I': ['Fundamentos de Programacion'],
      'Algebra Lineal': ['Matematica I'],
      'Matematica II': ['Matematica I'],
      'Analisis y Diseño de Algoritmos': ['Estructura de Datos'],
      'Programacion Orientada a Objetos II': ['Programacion Orientada a Objetos I'],
      'Matematica III': ['Matematica II'],
      'Matematicas Discretas II': ['Matematicas Discretas I'],
      'Probabilidades': ['Algebra Lineal', 'Matematica II'],
      'Algoritmos Paralelos': ['Analisis y Diseño de Algoritmos'],
      'Sistemas Distribuidos': ['Algoritmos Paralelos'],
      'Analisis y Diseño de Sistemas II': ['Analisis y Diseño de Sistemas I'],
      'Base de Datos II': ['Base de Datos I'],
      'Metodos Numericos': ['Matematica IV'],
      'Sistemas Digitales': ['Circuitos Electricos y Electronicos'],
      'Investigacion Operativa II': ['Investigacion Operativa I'],
      'Ingenieria de Software': ['Analisis y Diseño de Sistemas II', 'Base de Datos II'],
      'Business Intelligence': ['Base de Datos II'],
      'Aplicaciones Web II': ['Aplicaciones Web I'],
      'Arquitectura de Computadoras': ['Sistemas Digitales'],
      'Calidad de Software': ['Ingenieria de Software'],
      'Programacion de Dispositivos Moviles II': ['Programacion de Dispositivos Moviles I'],
      'Lenguaje de Bajo Nivel': ['Arquitectura de Computadoras'],
      'Cloud Computing': ['Data Mining'],
      'Programacion de Video Juegos II': ['Programacion de Video Juegos I'],
      'Redes II': ['Redes I'],
      'Inteligencia Artificial I': ['Procesamiento de Imagenes y Videos'],
      'Proyecto de Investigacion II': ['Proyecto de Investigacion I'],
      'Robotica II': ['Robotica I'],
      'Inteligencia Artificial II': ['Inteligencia Artificial I'],
      'Auditoria de Sistemas de Informacion': ['Seguridad Informatica'],
      'Seguridad de la Informacion': ['Seguridad Informatica'],
      'Seminario de Tesis': ['Proyecto de Investigacion II'],
      'Gestion de Proyectos II': ['Gestion de Proyectos I'],
      'Trabajo de Investigación': ['Proyecto de Investigacion II']
    };

    const prereqs = PREREQUISITES_MAP[name];
    if (!prereqs) return [];

    const passedIds = this.authService.currentUser()?.cursos_aprobados || [];
    const passedNames = new Set(
      this.todosLosCursos()
        .filter(x => passedIds.includes(x.id_curso))
        .map(x => x.nombre_curso.trim().toLowerCase())
    );

    return prereqs.filter(pr => {
      const exists = this.todosLosCursos().some(x => x.nombre_curso.trim().toLowerCase() === pr.toLowerCase());
      return exists && !passedNames.has(pr.toLowerCase());
    });
  }

  // Modal de Detalle de Curso (Catálogo interactivo)
  mostrarModalCursoDetalle = signal<boolean>(false);
  cursoDetalleSeleccionado = signal<Curso | null>(null);
  tutoresParaCursoDetalle = signal<Tutor[]>([]);
  recursosParaCursoDetalle = signal<any[]>([]);

  abrirDetalleCurso(curso: Curso): void {
    this.cursoDetalleSeleccionado.set(curso);
    this.mostrarModalCursoDetalle.set(true);

    this.http.get<any[]>(`${environment.apiUrl}/tutores-cursos`).subscribe({
      next: (tcList) => {
        const tutorIds = new Set(
          tcList
            .filter(tc => tc.id_curso === curso.id_curso && tc.estado_aprobacion === 'aprobado')
            .map(tc => tc.id_tutor)
        );
        const filtered = this.todosLosTutores().filter(u => tutorIds.has(u.id_usuario));
        this.tutoresParaCursoDetalle.set(filtered);
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${environment.apiUrl}/recursos`).subscribe({
      next: (recursosList) => {
        const filtered = recursosList.filter(r => r.id_curso === curso.id_curso);
        this.recursosParaCursoDetalle.set(filtered);
      },
      error: (err) => console.error(err)
    });
  }

  solicitarAsesoriaRapida(tutor: Tutor): void {
    this.mostrarModalCursoDetalle.set(false);
    this.abrirModalSolicitarConTutor(tutor);
    setTimeout(() => {
      const curso = this.cursoDetalleSeleccionado();
      if (curso) {
        this.nuevoIdCurso.set(curso.id_curso);
      }
    }, 100);
  }

  // Chat / Mensajería
  mensajesChat = signal<any[]>([]);
  conversaciones = signal<any[]>([]);
  idTutorChatSeleccionado = signal<number>(2);
  nuevoMensajeTexto = signal<string>('');

  mensajesSinLeerTotal = computed(() => {
    return this.conversaciones().reduce((acc, conv) => acc + (conv.mensajes_sin_leer || 0), 0);
  });

  ngOnDestroy(): void {
    this.destroyChatPolling();
  }

  cargarDatos(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.configNombres.set(user.nombres);
    this.configApellidos.set(user.apellidos);
    this.configCicloActual.set(user.ciclo_actual || 10);
    this.cicloActualEstudiante.set(user.ciclo_actual || 10);
    this.configCursosAprobados.set(user.cursos_aprobados || []);

    // Obtener asesorías del alumno
    this.http.get<Asesoria[]>(`${environment.apiUrl}/asesorias/alumno/${user.id}`).subscribe({
      next: (data) => {
        this.asesorias.set(data);
        
        // Calcular métricas en base a la BD
        const completadas = data.filter(a => a.estado === 'completada');
        this.totalCompletadas.set(completadas.length);
        // Cada asesoría completada acumula 1.5 horas de estudio
        this.horasAcumuladas.set(completadas.length * 1.5);
        
        // Contar tutores únicos activos con sesiones agendadas
        const tutoresUnicos = new Set(data.map(a => `${a.tutor_nombres} ${a.tutor_apellidos}`));
        this.tutoresActivos.set(tutoresUnicos.size);

        // Calcular próxima sesión si existe una pendiente/confirmada en el futuro
        const now = new Date().getTime();
        const proximas = data
          .filter(a => (a.estado === 'confirmada' || a.estado === 'pendiente') && new Date(a.fecha_programada).getTime() >= now)
          .sort((a, b) => new Date(a.fecha_programada).getTime() - new Date(b.fecha_programada).getTime());
        if (proximas.length > 0) {
          const prox = proximas[0];
          this.proximaCitaText.set(`${prox.nombre_curso} · Prof. ${prox.tutor_apellidos}`);
          
          const fechaObj = new Date(prox.fecha_programada);
          const dd = String(fechaObj.getDate()).padStart(2, '0');
          const mm = String(fechaObj.getMonth() + 1).padStart(2, '0');
          const yyyy = fechaObj.getFullYear();
          let hours = fechaObj.getHours();
          const minutes = String(fechaObj.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;
          const hourStr = String(hours).padStart(2, '0');
          
          this.proximaCitaHora.set(`${dd}/${mm}/${yyyy} - ${hourStr}:${minutes} ${ampm}`);
        } else {
          this.proximaCitaText.set('Sin sesiones programadas');
          this.proximaCitaHora.set('--/--/---- --:--');
        }

        // Obtener valoraciones reales de las asesorías del alumno para calcular la nota promedio
        this.http.get<any[]>(`${environment.apiUrl}/valoraciones`).subscribe({
          next: (vals) => {
            this.valoracionesList.set(vals);
            const studentAsesoriaIds = new Set(data.map(a => a.id_asesoria));
            const studentVals = vals.filter(v => studentAsesoriaIds.has(v.id_asesoria));
            if (studentVals.length > 0) {
              const sum = studentVals.reduce((acc, v) => acc + v.puntuacion, 0);
              const avg = (sum / studentVals.length) * 4; // Escalar a escala vigesimal (0-20)
              this.notaPromedio.set(Math.round(avg * 10) / 10);
            } else {
              this.notaPromedio.set(16.0); // Valor de partida en BD
            }
          }
        });
      },
      error: (err) => console.error('Error al cargar asesorías:', err)
    });

    // Obtener catálogo de cursos
    const carreraId = user.id_carrera || 1;
    this.http.get<Curso[]>(`${environment.apiUrl}/cursos?id_carrera=${carreraId}`).subscribe({
      next: (data) => this.todosLosCursos.set(data),
      error: (err) => console.error('Error al cargar cursos:', err)
    });

    // Obtener catálogo de tutores
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`).subscribe({
      next: (users) => {
        this.todosLosTutores.set(users);
        this.http.get<any[]>(`${environment.apiUrl}/tutores-cursos`).subscribe({
          next: (tcList) => {
            this.tutoresCursosMap.set(tcList);

            // Seleccionar por defecto el primer tutor disponible que no sea el mismo usuario
            const studentCourseIds = new Set(this.cursos().map(c => c.id_curso));
            const activeTutors = users.filter(u => {
              const tutorCourses = tcList.filter(tc => tc.id_tutor === u.id_usuario);
              const hasSharedCourse = tutorCourses.some(tc => studentCourseIds.has(tc.id_curso));
              return hasSharedCourse && u.id_usuario !== user.id;
            });
            if (activeTutors.length > 0) {
              const suitableTutor = activeTutors.find(t => t.id_usuario !== user.id);
              if (suitableTutor) {
                this.idTutorChatSeleccionado.set(suitableTutor.id_usuario);
                // Cargar los mensajes iniciales para este tutor
                this.cargarMensajería();
              }
            }
          }
        });
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });

    this.cargarNotificaciones();

    setTimeout(() => {
      this.isDashboardLoading.set(false);
    }, 600);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
  }

  cargarNotificaciones(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.http.get<any[]>(`${environment.apiUrl}/notificaciones/usuario/${user.id}`).subscribe({
      next: (data) => {
        this.notificacionesList.set(data);
      },
      error: (err) => console.error('Error al obtener notificaciones:', err)
    });
  }

  marcarLeida(n: any): void {
    if (n.leido) return;
    this.http.put(`${environment.apiUrl}/notificaciones/marcar-leida/${n.id_notificacion}`, {}).subscribe({
      next: () => {
        this.cargarNotificaciones();
      },
      error: (err) => console.error('Error al marcar notificación como leída:', err)
    });
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

  abrirModalSolicitarConTutor(tutor: Tutor): void {
    this.nuevoIdTutor.set(tutor.id_usuario);
    this.cargarHorariosTutor(tutor.id_usuario);
    const tutorCourses = this.cursosFiltradosModal();
    if (tutorCourses.length > 0) {
      this.nuevoIdCurso.set(tutorCourses[0].id_curso);
    } else {
      this.nuevoIdCurso.set(0);
    }
    this.mostrarModalSolicitar.set(true);
  }

  solicitarAsesoria(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!this.nuevoIdTutor() || !this.nuevoIdCurso() || !this.nuevaFecha() || !this.nuevaHora()) {
      this.notificationService.showToast('Por favor complete todos los campos.', 'error');
      return;
    }

    const selectedDate = new Date(this.nuevaFecha() + 'T00:00:00');
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const esSemestreI = (month >= 4 && month <= 7);
    const esSemestreII = (month >= 9 && month <= 11) || (month === 12 && day <= 24);

    if (!esSemestreI && !esSemestreII) {
      this.notificationService.showToast('La fecha debe estar en periodo académico: Semestre I (Abril-Julio) o Semestre II (Septiembre-24 de Diciembre).', 'error');
      return;
    }

    this.notificationService.showConfirm({
      title: 'Confirmar Solicitud de Asesoría',
      message: '¿Estás seguro de que deseas solicitar esta asesoría con el tutor seleccionado?',
      onConfirm: () => {
        const fechaHora = `${this.nuevaFecha()}T${this.nuevaHora()}:00`;

        const payload = {
          id_alumno: user.id,
          id_tutor: Number(this.nuevoIdTutor()),
          id_curso: Number(this.nuevoIdCurso()),
          fecha_programada: fechaHora,
          estado: 'pendiente',
          enlace_reunion: 'https://meet.google.com/' + Math.random().toString(36).substring(2, 11),
          motivo: this.nuevoMotivo().trim()
        };

        this.http.post(`${environment.apiUrl}/asesorias`, payload).subscribe({
          next: () => {
            this.mostrarModalSolicitar.set(false);
            this.nuevoMotivo.set('');
            this.cargarDatos();
            this.notificationService.showToast('Asesoría solicitada con éxito.', 'success');
          },
          error: (err) => {
            console.error('Error al crear asesoría:', err);
            this.notificationService.showToast('Ocurrió un error al solicitar la asesoría.', 'error');
          }
        });
      }
    });
  }

  cambiarAPanelTutor(): void {
    this.router.navigate(['/dashboard/tutor']);
  }

  selectedFilePostulacion: File | null = null;

  onFileSelectedPostulacion(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFilePostulacion = file;
      this.nombreArchivoPostulacion.set(file.name);
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
      title: 'Confirmar Postulación como Tutor',
      message: `¿Estás seguro de que deseas postularte para ser tutor de los ${this.cursosSeleccionadosPostulacion().length} cursos seleccionados?`,
      onConfirm: () => {
        const filePath = `boletas/${Date.now()}_${this.selectedFilePostulacion!.name}`;
        this.firebaseService.uploadFile(filePath, this.selectedFilePostulacion!).then((url) => {
          const courses = this.cursosSeleccionadosPostulacion();
          let errors = 0;

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
          console.error('Error al subir a Firebase Storage via Service:', err);
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
    }
    this.cargarDatos();
  }

  // ponytail: implement reactive polling using RxJS timer & switchMap to auto-sync chat messages
  startChatPolling(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.destroyChatPolling();

    this.chatSubscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          const tutorId = this.idTutorChatSeleccionado();
          if (!tutorId) return of({ conversaciones: [], chat: [] });
          return forkJoin({
            conversaciones: this.http.get<any[]>(`${environment.apiUrl}/mensajes/conversaciones/${user.id}?rol=tutor`),
            chat: this.http.get<any[]>(`${environment.apiUrl}/mensajes/chat/${user.id}/${tutorId}`)
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

  seleccionarTutorChat(idTutor: number): void {
    this.idTutorChatSeleccionado.set(idTutor);
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
      id_receptor: this.idTutorChatSeleccionado(),
      contenido: texto
    };

    this.http.post(`${environment.apiUrl}/mensajes`, payload).subscribe({
      next: (newMsg) => {
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

  onCicloChange(val: any): void {
    this.configCicloActual.set(Number(val));
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
      apellidos: this.configApellidos().trim(),
      ciclo_actual: Number(this.configCicloActual()),
      cursos_aprobados: this.configCursosAprobados()
    };

    this.http.put<any>(`${environment.apiUrl}/usuarios/${user.id}`, payload).subscribe({
      next: (res) => {
        this.authService.updateCurrentUser({ 
          nombres: res.nombres, 
          apellidos: res.apellidos,
          ciclo_actual: res.ciclo_actual,
          cursos_aprobados: res.cursos_aprobados
        });
        this.cicloActualEstudiante.set(res.ciclo_actual);
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

  logout(): void {
    this.authService.logout();
  }
}
