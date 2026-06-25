import { Rol } from './rol.model';

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  codigo_universitario?: string;
  nombre_carrera?: string;
  id_carrera?: number;
  ciclo_actual?: number;
  roles?: any[];
  cursos_aprobados?: number[];
  ano_ingreso?: number;
}
