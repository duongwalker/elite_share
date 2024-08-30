import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
      navigate('/login'); // Redirect to the homepage or any other route
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go to Login Page
        </button>
      </div>
    );
}
