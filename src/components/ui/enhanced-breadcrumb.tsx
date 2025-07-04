
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const EnhancedBreadcrumb = ({ items, className }: EnhancedBreadcrumbProps) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-gray-600 mb-6", className)}>
      <Link 
        to="/" 
        className="flex items-center hover:text-orange-600 transition-colors duration-200"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-orange-600 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default EnhancedBreadcrumb;
