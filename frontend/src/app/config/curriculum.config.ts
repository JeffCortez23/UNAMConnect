/**
 * Configuración curricular y fechas académicas centralizadas
 */

export const CURRICULUM_CONFIG = {
  /**
   * Determina si una fecha cae dentro del rango de semestres académicos activos
   * Semestre I: Abril (4) a Julio (7)
   * Semestre II: Septiembre (9) a 24 de Diciembre (12)
   * @param date Fecha a validar
   */
  isAcademicSemesterActive(date: Date): boolean {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const esSemestreI = (month >= 4 && month <= 7);
    const esSemestreII = (month >= 9 && month <= 11) || (month === 12 && day <= 24);
    return esSemestreI || esSemestreII;
  },

  /**
   * Obtiene la etiqueta del ciclo académico activo actual (ej: "Ciclo 2026-I")
   * @param date Fecha base para el cálculo
   */
  getActiveAcademicCycleString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (month >= 4 && month <= 7) {
      return `Ciclo ${year}-I`;
    } else if ((month >= 9 && month <= 11) || (month === 12 && day <= 24)) {
      return `Ciclo ${year}-II`;
    } else {
      if (month < 4) {
        return `Ciclo ${year}-I`;
      } else {
        return `Ciclo ${year}-II`;
      }
    }
  },

  /**
   * Nombre de los números romanos para los ciclos de estudios
   */
  cicloNumerals: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
};
