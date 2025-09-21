import { supabaseAdmin } from '@/lib/supabase/admin'; // Gunakan admin client untuk user
import { createClient } from '@/lib/supabase/server';

function getMonthDateRange(year: number, month: number) {
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    return { startDate, endDate };
}

export async function getDashboardStats() {
    const supabase = createClient();
    const now = new Date();
    const thisMonth = getMonthDateRange(now.getFullYear(), now.getMonth());
    const lastMonth = getMonthDateRange(now.getFullYear(), now.getMonth() - 1);

    const [
        totalUsersRes, // Variabel ini akan diisi dari supabaseAdmin
        totalBannersRes,
        totalVideosRes,
        totalSponsorsRes,
        totalCategoriesRes,
        totalAdsRes,
        totalArticlesRes,
        articlesThisMonthRes,
        articlesLastMonthRes,
        topArticlesAllTime,
        topArticlesThisMonth,
        topArticlesLastMonth,
    ] = await Promise.all([
        supabaseAdmin.auth.admin.listUsers(), // <-- PERUBAHAN 1: Mengambil list semua user
        supabase.from('banner').select('id_banner', { count: 'exact', head: true }),
        supabase.from('video').select('id_video', { count: 'exact', head: true }),
        supabase.from('sponsor').select('id_sponsor', { count: 'exact', head: true }),
        supabase.from('kategori').select('id_kategori', { count: 'exact', head: true }),
        supabase.from('iklan').select('id_iklan', { count: 'exact', head: true }),
        supabase.from('artikel').select('id_artikel', { count: 'exact', head: true }),
        supabase.from('artikel').select('id_artikel', { count: 'exact', head: true }).gte('created_at', thisMonth.startDate).lte('created_at', thisMonth.endDate),
        supabase.from('artikel').select('id_artikel', { count: 'exact', head: true }).gte('created_at', lastMonth.startDate).lte('created_at', lastMonth.endDate),
        // <-- PERUBAHAN 2: Menambahkan join untuk mengambil nama penulis
        supabase.from('artikel').select('judul_artikel, views, penulis:users!inner(nama_user)').order('views', { ascending: false }).limit(5),
        supabase.from('artikel').select('judul_artikel, views, penulis:users!inner(nama_user)').gte('created_at', thisMonth.startDate).lte('created_at', thisMonth.endDate).order('views', { ascending: false }).limit(10),
        supabase.from('artikel').select('judul_artikel, views, penulis:users!inner(nama_user)').gte('created_at', lastMonth.startDate).lte('created_at', lastMonth.endDate).order('views', { ascending: false }).limit(10),
    ]);

    return {
        totalUsers: totalUsersRes.data?.users?.length ?? 0, // <-- PERUBAHAN 1: Menghitung dari hasil listUsers
        totalBanners: totalBannersRes.count ?? 0,
        totalVideos: totalVideosRes.count ?? 0,
        totalSponsors: totalSponsorsRes.count ?? 0,
        totalCategories: totalCategoriesRes.count ?? 0,
        totalAds: totalAdsRes.count ?? 0,
        totalArticles: totalArticlesRes.count ?? 0,
        totalArticlesThisMonth: articlesThisMonthRes.count ?? 0,
        totalArticlesLastMonth: articlesLastMonthRes.count ?? 0,
        topArticlesAllTime: topArticlesAllTime.data || [],
        topArticlesThisMonth: topArticlesThisMonth.data || [],
        topArticlesLastMonth: topArticlesLastMonth.data || [],
    };
}