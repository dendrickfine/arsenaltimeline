import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
            <div className="bg-blue-100 text-blue-600 text-3xl p-4 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}