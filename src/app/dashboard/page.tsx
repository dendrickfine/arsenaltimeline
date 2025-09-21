import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getDashboardStats } from './lib/get-dashboard-stats';
import DashboardClientPage from './DashboardClientPage';

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect('/login');

    const rawStats = await getDashboardStats();

    // Hitung total views dari data artikel yang sudah diambil
    const totalViews = rawStats.topArticlesAllTime.reduce((acc, article) => acc + article.views, 0);

    const statsForPage = {
        totalUsers: rawStats.totalUsers,
        totalArticles: rawStats.totalArticles,
        totalCategories: rawStats.totalCategories,
        totalBanners: rawStats.totalBanners,
        totalVideos: rawStats.totalVideos,
        totalSponsors: rawStats.totalSponsors,
        totalAds: rawStats.totalAds,
        totalArticlesThisMonth: rawStats.totalArticlesThisMonth,
        totalArticlesLastMonth: rawStats.totalArticlesLastMonth,
        totalViews: totalViews,
    };

    return (
        <div className="min-h-screen p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Header - Full width with better spacing */}
                <div className="p-6 rounded-xl shadow-lg">
                    <div className="p-4 rounded-lg">
                        <h1 className="text-3xl font-bold mb-2 text-black">
                            Welcome back, {session.user.user_metadata.nama_user || session.user.email}!
                        </h1>
                        <p className="text-black">
                            Here's a comprehensive overview of Arsenal Timeline content performance.
                        </p>
                    </div>
                </div>

                {/* Render komponen client dengan data dari server */}
                <DashboardClientPage
                    stats={statsForPage}
                    topArticlesAllTime={rawStats.topArticlesAllTime}
                    topArticlesThisMonth={rawStats.topArticlesThisMonth}
                    topArticlesLastMonth={rawStats.topArticlesLastMonth}
                />
            </div>
        </div>
    );
}