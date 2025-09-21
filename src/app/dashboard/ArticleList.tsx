import { FaEye, FaUserEdit, FaTrophy } from 'react-icons/fa';

interface Article {
    judul_artikel: string;
    views: number;
    penulis?: {
        nama_user: string;
    }
}

interface ArticleListProps {
    title: string;
    articles: Article[];
}

export default function ArticleList({ title, articles }: ArticleListProps) {
    const getRankIcon = (index: number) => {
        if (index === 0) return <FaTrophy className="text-yellow-500" />;
        if (index === 1) return <FaTrophy className="text-gray-400" />;
        if (index === 2) return <FaTrophy className="text-orange-500" />;
        return <span className="text-gray-400 font-bold text-sm">#{index + 1}</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg safari-shadow-fix h-full">
            <div className="p-6">
                <h3 className="text-xl font-bold mb-6 text-[#1f2937]">{title}</h3>
                {articles.length > 0 ? (
                    <ul className="space-y-4">
                        {articles.map((article, index) => (
                            <li key={index} className="group">
                                <div className="flex items-start gap-3 p-3 rounded-lg">
                                    <div className="flex-shrink-0 mt-1">
                                        {getRankIcon(index)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#1f2937] font-semibold text-sm leading-snug">
                                            {article.judul_artikel}
                                        </p>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                                                <FaUserEdit className="text-xs" />
                                                <span className="truncate max-w-[100px]">
                                                    {article.penulis?.nama_user || 'Anonymous'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-[#374151] bg-[#f3f4f6] px-2 py-1 rounded-full">
                                                <FaEye className="text-xs" />
                                                <span>{article.views.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-[#d1d5db] text-4xl mb-3">📝</div>
                        <p className="text-[#9ca3af] text-sm">No articles to display yet.</p>
                    </div>
                )}
            </div>
        </div>
        );
}