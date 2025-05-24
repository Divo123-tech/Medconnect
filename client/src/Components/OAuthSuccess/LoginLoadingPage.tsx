import React, { useState, useEffect } from 'react';

export default function LoginLoadingPage() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 800);

    return () => {
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Subtle Loading Spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 animate-spin"></div>
        </div>

        {/* Simple Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-slate-700">
            Logging you in{dots}
          </h2>
          <p className="text-slate-500 text-sm">
            Please wait a moment
          </p>
        </div>

        {/* Minimal Progress Indicator */}
        <div className="flex space-x-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
              style={{
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}