
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Home, Search, Heart, User, Settings, Menu, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavigation = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: 'Home', href: '/', active: true },
    { icon: Search, label: 'Search', href: '/properties' },
    { icon: Heart, label: 'Saved', href: '/tenant-portal', badge: 3 },
    { icon: Bell, label: 'Alerts', href: '/tenant-portal', badge: 2 },
    { icon: User, label: 'Profile', href: user ? '/profile' : '/auth' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          ))}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 text-gray-600">
                <Menu className="w-5 h-5" />
                <span className="text-xs mt-1">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="py-4">
                <h3 className="font-semibold mb-4">Menu</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/properties" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                    <Search className="w-5 h-5" />
                    Properties
                  </a>
                  <a href="/tenant-portal" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                    <Heart className="w-5 h-5" />
                    Saved Properties
                  </a>
                  <a href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                    <User className="w-5 h-5" />
                    Profile
                  </a>
                  <a href="/tenant-portal" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                    <Settings className="w-5 h-5" />
                    Settings
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default MobileNavigation;
