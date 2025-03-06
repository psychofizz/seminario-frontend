'use client';

import { useEffect, useState, useRef } from 'react';
import { courseAPI, fileAPI } from '@/lib/api';
import { Course, ResourceFile } from '@/types';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';

export default function CourseResourcesPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const admin = isAdmin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar información del curso y los recursos en paralelo
        const [courseData, resourcesData] = await Promise.all([
          courseAPI.getById(id),
          courseAPI.getResources(id)
        ]);
        
        setCourse(courseData);
        setResources(resourcesData || []);
      } catch (err: any) {
        setError('Error al cargar los datos: ' + (err.message || 'Desconocido'));
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      const file = files[0];
      await fileAPI.uploadResource(id, file);
      
      // Actualizar la lista de recursos después de la carga
      const resourcesData = await courseAPI.getResources(id);
      setResources(resourcesData || []);
      
      // Limpiar input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setUploadError('Error al subir el archivo: ' + (err.message || 'Desconocido'));
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'No definido';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Desconocido';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p>Cargando recursos del curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-2">Error</h1>
        <p>{error}</p>
        <Link href={`/courses/${id}`} className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al curso
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
        <h1 className="text-xl font-bold mb-2">Curso no encontrado</h1>
        <p>El curso que estás buscando no existe o ha sido eliminado.</p>
        <Link href="/courses" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a la lista de cursos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href={`/courses/${id}`} className="text-blue-600 hover:underline inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Volver al curso
          </Link>
          <h1 className="text-3xl font-bold mt-2">Recursos</h1>
          <p className="text-gray-600">{course.name}</p>
        </div>
        
        {admin && (
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <button 
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={isUploading}
            >
              {isUploading ? 'Subiendo...' : 'Subir Recurso'}
            </button>
          </div>
        )}
      </div>
      
      {uploadError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {uploadError}
        </div>
      )}
      
      {resources.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-4">No hay recursos disponibles para este curso.</p>
          {admin && (
            <div className="relative inline-block">
              <input
                ref={fileInputRef}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <button 
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${isUploading ? 'text-blue-400 bg-blue-50' : 'text-blue-700 bg-blue-100 hover:bg-blue-200'}`}
                disabled={isUploading}
              >
                {isUploading ? 'Subiendo...' : 'Subir el primer recurso'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resource.mimetype || 'Desconocido'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatFileSize(resource.filesize)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(resource.timecreated)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_URL}/files/resource/${resource.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar
                      </a>
                      {admin && (
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
                              // Aquí iría la lógica para eliminar el recurso
                              alert('Función de eliminación no implementada');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}