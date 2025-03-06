// app/(dashboard)/courses/[id]/assignments/[assignmentId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { assignmentsAPI } from '@/lib/api/rest';
import { formatDate } from '@/lib/utils/dateFormatter';
import { useAuth } from '@/lib/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import FileUploader from '@/components/common/FileUploader';

// Define types
type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxGrade: number;
  submissionStatus?: {
    submitted: boolean;
    submissionId?: string;
    submissionDate?: string;
    grade?: number;
    status?: string;
  };
};

export default function AssignmentDetailPage() {
  const { id: courseId, assignmentId } = useParams<{ id: string; assignmentId: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!isAuthenticated || !courseId || !assignmentId) return;
      
      setLoading(true);
      try {
        // First get the basic assignment info
        const assignments = await assignmentsAPI.getCourseAssignments(courseId);
        const currentAssignment = assignments.find((a: any) => a.id.toString() === assignmentId);
        
        if (!currentAssignment) {
          setError('Assignment not found');
          return;
        }
        
        // If available, get the user's submission status
        // This is a hypothetical endpoint that might need to be created
        if (user) {
          try {
            const submissionStatus = await assignmentsAPI.getSubmissionStatus(assignmentId, user.user_id.toString());
            currentAssignment.submissionStatus = submissionStatus;
          } catch (submissionError) {
            console.error('Error fetching submission status:', submissionError);
            // Continue without submission status if it fails
          }
        }
        
        setAssignment(currentAssignment);
      } catch (err) {
        console.error('Error fetching assignment:', err);
        setError('Failed to load assignment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [isAuthenticated, courseId, assignmentId, user]);

  // Handle file submission
  const handleFileSubmit = async (file: File) => {
    if (!file || !assignmentId) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await assignmentsAPI.submitAssignment(assignmentId, formData);
      setSubmissionSuccess(true);
      
      // Refresh assignment data to update submission status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting assignment:', err);
      setError(err.response?.data?.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle downloading submission
  const handleDownloadSubmission = async () => {
    if (!assignment?.submissionStatus?.submissionId) return;
    
    try {
      const blob = await assignmentsAPI.downloadSubmission(
        assignmentId, 
        assignment.submissionStatus.submissionId
      );
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `assignment-${assignmentId}-submission.pdf`; // Default name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading submission:', err);
      setError('Failed to download your submission. Please try again later.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 mb-4">Assignment not found</p>
        <Link 
          href={`/courses/${courseId}/assignments`}
          className="text-blue-500 hover:underline"
        >
          Back to assignments
        </Link>
      </div>
    );
  }

  // Calculate if the assignment is past due
  const isPastDue = new Date(assignment.dueDate) < new Date();
  const canSubmit = !isPastDue && (!assignment.submissionStatus?.submitted || assignment.submissionStatus?.status === 'draft');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation breadcrumb */}
      <div className="flex text-sm text-gray-500 mb-6">
        <Link href="/courses" className="hover:text-blue-600">Cursos</Link>
        <span className="mx-2">/</span>
        <Link href={`/courses/${courseId}`} className="hover:text-blue-600">Detalles del Curso</Link>
        <span className="mx-2">/</span>
        <Link href={`/courses/${courseId}/assignments`} className="hover:text-blue-600">Tareas</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{assignment.title}</span>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Assignment header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Fecha límite: {formatDate(assignment.dueDate)}
            </div>
            
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Calificación máxima: {assignment.maxGrade}
            </div>
            
            {assignment.submissionStatus?.submitted && (
              <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Entregado: {formatDate(assignment.submissionStatus.submissionDate || '')}
              </div>
            )}
            
            {isPastDue && !assignment.submissionStatus?.submitted && (
              <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Fecha límite superada
              </div>
            )}
            
            {assignment.submissionStatus?.grade !== undefined && (
              <div className={`${
                assignment.submissionStatus.grade >= (assignment.maxGrade * 0.7)
                  ? 'bg-green-50 text-green-700' 
                  : assignment.submissionStatus.grade >= (assignment.maxGrade * 0.6)
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-700'
              } px-3 py-1 rounded-full text-sm flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Calificación: {assignment.submissionStatus.grade} / {assignment.maxGrade}
              </div>
            )}
          </div>
        </div>
        
        {/* Assignment description */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-3">Descripción</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.description }} />
        </div>
        
        {/* Submission section */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Estado de la entrega</h2>
          
          {assignment.submissionStatus?.submitted ? (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700">Tu tarea ha sido entregada</p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Entregado el {formatDate(assignment.submissionStatus.submissionDate || '')}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleDownloadSubmission}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Descargar mi entrega
                </button>
                
                {canSubmit && (
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Editar mi entrega
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {isPastDue ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700">La fecha límite para esta tarea ha expirado</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    No has entregado esta tarea todavía. Sube un archivo para completar tu entrega.
                  </p>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {submissionSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <p className="text-green-700">¡Tu tarea ha sido entregada con éxito!</p>
                    </div>
                  )}
                  
                  <FileUploader 
                    onFileSelect={handleFileSubmit}
                    isUploading={submitting}
                    accept=".pdf,.doc,.docx,.zip"
                    maxSize={20} // 20MB
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}