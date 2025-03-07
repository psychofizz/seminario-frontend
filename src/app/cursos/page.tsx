// app/dashboard/courses/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StudentCourses from './student-courses';

export default function CoursesPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [inputUserId, setInputUserId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedId = parseInt(inputUserId, 10);
    if (!isNaN(parsedId)) {
      setUserId(parsedId);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Cursos</h1>
        
        {!userId ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">ID de Usuario</Label>
                <Input
                  id="userId"
                  type="number"
                  value={inputUserId}
                  onChange={(e) => setInputUserId(e.target.value)}
                  placeholder="Ingresa el ID del estudiante"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Ver Cursos</Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Usuario ID: {userId}</p>
              <Button 
                variant="ghost" 
                onClick={() => setUserId(null)}
              >
                Cambiar Usuario
              </Button>
            </div>
            
            <StudentCourses userId={userId} />
          </div>
        )}
      </div>
  );
}
