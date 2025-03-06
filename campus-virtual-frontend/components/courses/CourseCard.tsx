// components/courses/CourseCard.tsx
import Link from 'next/link';
import { formatDate } from '@/lib/utils/dateFormatter';

type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
};

type CourseCardProps = {
  course: Course;
};

// Function to generate random gradient colors for course cards
function getRandomGradient() {
  const gradients = [
    'bg-gradient-to-r from-blue-500 to-purple-500',
    'bg-gradient-to-r from-green-400 to-blue-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-yellow-400 to-orange-500',
    'bg-gradient-to-r from-teal-400 to-green-500',
    'bg-gradient-to-r from-indigo-500 to-blue-500',
    'bg-gradient-to-r from-red-500 to-pink-500',
  ];
  
  // Use course id as seed to get consistent colors for the same course
  const index = parseInt(course.id, 10) % gradients.length;
  return gradients[index] || gradients[0];
}

export default function CourseCard({ course }: CourseCardProps) {
  const gradient = getRandomGradient();
  
  // Limit description to 100 characters
  const shortDescription = course.description.length > 100
    ? course.description.substring(0, 100) + '...'
    : course.description;
  
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-lg">
        {/* Course header with gradient */}
        <div className={`${gradient} h-24 p-4`}>
          <h3 className="text-white font-bold text-xl mb-1 truncate">{course.name}</h3>
          <p className="text-white text-sm opacity-80">{course.code}</p>
        </div>
        
        {/* Course content */}
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">{shortDescription}</p>
          
          <div className="flex justify-between text-xs text-gray-500">
            <div>
              <span className="block font-semibold">Inicio</span>
              <span>{formatDate(course.startDate)}</span>
            </div>
            <div className="text-right">
              <span className="block font-semibold">Fin</span>
              <span>{formatDate(course.endDate)}</span>
            </div>
          </div>
        </div>
        
        {/* Course footer */}
        <div className="border-t border-gray-200 p-4 flex justify-between items-center">
          <span className="text-sm font-medium text-blue-600">Ver curso</span>
          <span className={`${course.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded-full`}>
            {course.isVisible ? 'Visible' : 'Oculto'}
          </span>
        </div>
      </div>
    </Link>
  );
}