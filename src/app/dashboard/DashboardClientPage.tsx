'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaNewspaper, FaUsers, FaEye, FaFolderOpen, FaRegImage, FaVideo, FaHandshake, FaBullhorn } from 'react-icons/fa';
import ArticleList from './ArticleList';

ChartJS.register(ArcElement, Tooltip, Legend);

// Tipe data untuk props
type Stats = {
    totalUsers: number;
    totalArticles: number;
    totalCategories: number;
    totalBanners: number;
    totalVideos: number;
    totalSponsors: number;
    totalAds: number;
    totalArticlesThisMonth: number;
    totalArticlesLastMonth: number;
    totalViews: number;
};

type Article = {
    judul_artikel: string;
    views: number;
    penulis?: { nama_user: string; };
};

type PageProps = {
    stats: Stats;
    topArticlesAllTime: Article[];
    topArticlesThisMonth: Article[];
    topArticlesLastMonth: Article[];
};

// Compact StatCard Component
function StatCard({ title, value, icon, color }: {
    title: string,
    value: string | number,
    icon: React.ReactNode,
    color: string
}) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
                <div className={`${color} text-white text-lg p-2 rounded-lg`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide truncate">{title}</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}

export default function DashboardClientPage({ stats, topArticlesAllTime, topArticlesThisMonth, topArticlesLastMonth }: PageProps) {
    const chartData = {
        labels: ['This Month', 'Last Month'],
        datasets: [{
            label: 'Articles Created',
            data: [stats.totalArticlesThisMonth, stats.totalArticlesLastMonth],
            backgroundColor: [
                '#EF0107',
                '#063672',
            ],
            borderColor: [
                'EF0107',
                '063672'
            ],
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 8,
            }
        },
        cutout: '60%',
    };

    return (
        <div className="space-y-6">
            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section - Article Lists (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ArticleList title="🔥 Top 10 This Month" articles={topArticlesThisMonth} />
                        <ArticleList title="📈 Top 10 Last Month" articles={topArticlesLastMonth} />
                    </div>
                </div>

                {/* Right Section - Chart and All Time (1/3 width) */}
                <div className="lg:col-span-1 flex flex-col space-y-6">
                    {/* Chart Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            📊 Article Comparison
                        </h3>
                        <div className="h-64">
                            <Doughnut data={chartData} options={chartOptions} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Growth Rate:</span>
                                <span className={`font-semibold ${stats.totalArticlesThisMonth > stats.totalArticlesLastMonth
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}>
                                    {stats.totalArticlesLastMonth > 0
                                        ? `${(((stats.totalArticlesThisMonth - stats.totalArticlesLastMonth) / stats.totalArticlesLastMonth) * 100).toFixed(1)}%`
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* All Time Articles */}
                    <ArticleList title="🏆 Top 5 All Time" articles={topArticlesAllTime} />
                </div>
            </div>
            {/* Compact Statistics Grid - 8 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard title="Articles" value={stats.totalArticles} icon={<FaNewspaper />} color="bg-blue-500" />
                <StatCard title="Views" value={stats.totalViews.toLocaleString('id-ID')} icon={<FaEye />} color="bg-red-500" />
                <StatCard title="Users" value={stats.totalUsers} icon={<FaUsers />} color="bg-blue-500" />
                <StatCard title="Categories" value={stats.totalCategories} icon={<FaFolderOpen />} color="bg-red-500" />
                <StatCard title="Banners" value={stats.totalBanners} icon={<FaRegImage />} color="bg-blue-500" />
                <StatCard title="Videos" value={stats.totalVideos} icon={<FaVideo />} color="bg-red-500" />
                <StatCard title="Sponsors" value={stats.totalSponsors} icon={<FaHandshake />} color="bg-blue-500" />
                <StatCard title="Ads" value={stats.totalAds} icon={<FaBullhorn />} color="bg-red-500" />
            </div>
        </div>
    );
}