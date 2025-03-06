// lib/utils/dateFormatter.ts

/**
 * Formats a date string into a localized format
 * @param dateString - The date string to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
    dateString: string, 
    options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
  ): string => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error en formato de fecha';
    }
  };
  
  /**
   * Formats a date string into a relative time format (e.g. '2 days ago')
   * @param dateString - The date string to format
   * @returns Relative time string
   */
  export const formatRelativeTime = (dateString: string): string => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      // Less than a minute
      if (diffInSeconds < 60) {
        return 'Justo ahora';
      }
      
      // Less than an hour
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
      }
      
      // Less than a day
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      }
      
      // Less than a week
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
      }
      
      // Use standard date format for older dates
      return formatDate(dateString);
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return 'Error en formato de fecha';
    }
  };
  
  /**
   * Checks if a date is in the past
   * @param dateString - The date string to check
   * @returns Boolean indicating if the date is in the past
   */
  export const isPastDate = (dateString: string): boolean => {
    if (!dateString) return false;
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      return date < now;
    } catch (error) {
      console.error('Error checking if date is in the past:', error);
      return false;
    }
  };
  
  /**
   * Formats a date range (start and end dates)
   * @param startDateString - The start date string
   * @param endDateString - The end date string
   * @returns Formatted date range string
   */
  export const formatDateRange = (
    startDateString: string, 
    endDateString: string
  ): string => {
    if (!startDateString || !endDateString) {
      return 'Fechas no disponibles';
    }
    
    try {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      
      // Check if the dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Fechas inválidas';
      }
      
      // If dates are in the same year, only show the year once
      if (startDate.getFullYear() === endDate.getFullYear()) {
        const startFormatted = startDate.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short' 
        });
        const endFormatted = endDate.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
        
        return `${startFormatted} - ${endFormatted}`;
      } else {
        const startFormatted = startDate.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
        const endFormatted = endDate.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
        
        return `${startFormatted} - ${endFormatted}`;
      }
    } catch (error) {
      console.error('Error formatting date range:', error);
      return 'Error en formato de fechas';
    }
  };