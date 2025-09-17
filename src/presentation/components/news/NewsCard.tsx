import Link from "next/link";
import { formatDate } from "@/lib/utils/date";

interface NewsCardProps {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
  imageUrl?: string;
  views?: number;
  href: string;
}

export function NewsCard({
  id,
  title,
  content,
  date,
  author,
  category,
  imageUrl,
  views = 0,
  href,
}: NewsCardProps) {
  return (
    <Link href={href} className="block">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
        {imageUrl && (
          <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
              {category}
            </span>
            <time className="text-sm text-gray-500 ml-auto">
              {formatDate(date)}
            </time>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{author}</span>
            {views !== undefined && <span>조회수 {views.toLocaleString()}</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}