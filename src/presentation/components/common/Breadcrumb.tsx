import Link from 'next/link';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'default' | 'light';
}

export function Breadcrumb({ items, variant = 'default' }: BreadcrumbProps) {
  const isLight = variant === 'light';

  return (
    <nav className={isLight ? '' : 'mb-8'} aria-label="Breadcrumb">
      <ol className={`flex items-center space-x-2 text-sm ${isLight ? 'text-white/80 font-bold' : 'text-gray-600 font-bold'}`}>
        <li>
          <Link href="/" className={isLight ? 'hover:text-white' : 'hover:text-blue-600'}>홈</Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              {item.href ? (
                <Link href={item.href} className={isLight ? 'hover:text-white' : 'hover:text-blue-600'}>
                  {item.label}
                </Link>
              ) : (
                <span className={isLight ? 'text-white font-bold' : 'text-gray-900 font-bold'}>{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}