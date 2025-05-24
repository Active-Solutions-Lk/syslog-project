import React from 'react';

const getProgressColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
};

const getProgressGradient = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 90) return 'bg-gradient-to-r from-green-200 via-blue-400 to-red-600';
    if (percentage >= 75) return 'bg-gradient-to-r from-blue-200 to-red-400';
    if (percentage >= 50) return 'bg-gradient-to-r from-green-200 to-blue-400';
    return 'bg-gradient-to-r from-blue-400 to-blue-400';
};

const ProgressBar = ({ value, max, color, gradient }) => {
    const percentage = (value / max) * 100;
    const progressColor = color || getProgressGradient(value, max);
    const displayValue = value > max ? max : value;

    // Use gradient if provided, otherwise fallback to color
    const barClass = gradient
        ? `h-full rounded-full ${gradient}`
        : `h-full rounded-full ${progressColor}`;

    return (
        <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
            <div
                className={barClass}
                style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
            >
                <span className="pl-2 text-white text-sm font-medium">
                    {displayValue}/{max}
                </span>
            </div>
        </div>
    );
};

export default ProgressBar;
