// components/common/LoadingSpinner.tsx

type LoadingSpinnerProps = {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'white';
    fullScreen?: boolean;
  };
  
  export default function LoadingSpinner({ 
    size = 'medium', 
    color = 'primary',
    fullScreen = false
  }: LoadingSpinnerProps) {
    // Determine spinner size
    const sizeClasses = {
      small: 'h-5 w-5',
      medium: 'h-8 w-8',
      large: 'h-12 w-12'
    };
    
    // Determine spinner color
    const colorClasses = {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      white: 'text-white'
    };
    
    const spinnerClasses = `inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${colorClasses[color]}`;
    
    if (fullScreen) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className={spinnerClasses} role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center p-4">
        <div className={spinnerClasses} role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }