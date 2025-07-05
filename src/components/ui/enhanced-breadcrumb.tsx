
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
    <nav className={cn("flex items-center space-x-1 mb-8", className)}>
      <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200/50">
        <div className="flex items-center space-x-2 text-sm">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 hover:text-orange-600 transition-all duration-300 group"
          >
            <div className="p-1.5 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
              <Home className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span className="ml-2 font-medium">Home</span>
          </Link>
          
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <div className="text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </div>
              {item.href ? (
                <Link 
                  to={item.href} 
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-300 font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default EnhancedBreadcrumb;
