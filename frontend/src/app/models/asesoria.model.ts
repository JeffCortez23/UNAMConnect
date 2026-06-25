export interface Asesoria {
  id_asesoria: number;
  id_alumno: number;
  id_tutor: number;
  fecha_programada: string;
  estado: string;
  enlace_reunion?: string;
  alumno_nombres?: string;
  alumno_apellidos?: string;
  tutor_nombres?: string;
  tutor_apellidos?: string;
  nombre_curso?: string;
  motivo?: string;
}
