import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 dark:bg-green-600 text-white';
            case 'error':
                return 'bg-red-500 dark:bg-red-600 text-white';
            case 'warning':
                return 'bg-yellow-500 dark:bg-yellow-600 text-white';
            default:
                return 'bg-blue-500 dark:bg-blue-600 text-white';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            <div className={`${getToastStyles()} rounded-lg shadow-lg p-4 max-w-sm flex items-center space-x-3`}>
                <span className="text-lg">{getIcon()}</span>
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose(), 300);
                    }}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Toast; 