
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Monitor,
  Shield,
  CheckSquare,
  FileText,
  User,
  Building,
  Moon,
  Sun,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Team Space', href: '/team-space', icon: Users },
  { name: 'Device Space', href: '/device-space', icon: Monitor },
  { name: 'Compliance Space', href: '/compliance-space', icon: Shield },
  { name: 'Validation Space', href: '/validation-space', icon: CheckSquare },
  { name: 'Reports Space', href: '/reports-space', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
];

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const orgLeaderNav = user?.role === 'organization-lead' 
    ? [{ name: 'Organization Space', href: '/organization-space', icon: Building }]
    : [];

  const allNavigation = [...navigation.slice(0, -1), ...orgLeaderNav, navigation[navigation.length - 1]];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-50",
          "transform transition-all duration-300 ease-in-out",
          "glass-effect shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto",
          // Hover expand effect
          isHovered ? "w-80" : "w-20",
          "lg:w-20 lg:hover:w-80"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border overflow-hidden">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className={cn(
              "transition-all duration-300 ease-in-out",
              isHovered || isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:opacity-0 lg:-translate-x-2"
            )}>
              <h2 className="font-bold text-lg text-sidebar-foreground whitespace-nowrap">Governer</h2>
              <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Security First</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              "lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors",
              isHovered || isOpen ? "opacity-100" : "opacity-0"
            )}
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-hidden">
          <div className="mb-6">
            <h3 className={cn(
              "text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 transition-all duration-300",
              isHovered || isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"
            )}>
              Navigation
            </h3>
            {allNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    isActivePath(item.href)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(
                    "font-medium whitespace-nowrap transition-all duration-300",
                    isHovered || isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:opacity-0 lg:-translate-x-2"
                  )}>
                    {item.name}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {!isHovered && !isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-accent text-sidebar-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-sidebar-border my-6"></div>

          {/* External Links */}
          <div className="mb-6">
            <h3 className={cn(
              "text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 transition-all duration-300",
              isHovered || isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"
            )}>
              External
            </h3>
            <a
              href="https://smartedge.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 group relative"
            >
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
              <span className={cn(
                "font-medium whitespace-nowrap transition-all duration-300",
                isHovered || isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:opacity-0 lg:-translate-x-2"
              )}>
                SmartEdge.in
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isHovered && !isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-accent text-sidebar-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                  SmartEdge.in
                </div>
              )}
            </a>
          </div>

          {/* Theme Toggle */}
          <div className="border-t border-sidebar-border pt-6">
            <h3 className={cn(
              "text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 transition-all duration-300",
              isHovered || isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"
            )}>
              Preferences
            </h3>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 w-full group relative"
            >
              {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              <span className={cn(
                "font-medium whitespace-nowrap transition-all duration-300",
                isHovered || isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:opacity-0 lg:-translate-x-2"
              )}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isHovered && !isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-accent text-sidebar-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </div>
              )}
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar/80 overflow-hidden">
          <div className={cn(
            "text-center transition-all duration-300",
            isHovered || isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"
          )}>
            <p className="text-xs text-sidebar-foreground/60">
              © 2024 SmartEdge Technologies
            </p>
            <p className="text-xs text-sidebar-foreground/40 mt-1">
              Secured by CIS Standards
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-3 bg-sidebar border border-sidebar-border rounded-xl shadow-lg glass-effect"
      >
        <Menu className="w-6 h-6 text-sidebar-foreground" />
      </button>
    </>
  );
}
