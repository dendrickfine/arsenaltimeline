/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nbagjgrumkydmtumrnzq.supabase.co', // <-- Salin hostname dari pesan error Anda ke sini
      },
    ],
  },
};

export default nextConfig;