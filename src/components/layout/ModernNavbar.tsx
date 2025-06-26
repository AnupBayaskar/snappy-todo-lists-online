
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ExternalLink, User } from 'lucide-react';

const ModernNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-lg border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-green to-brand-gray rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <Link 
              to="/" 
              className="text-xl font-bold bg-gradient-to-r from-brand-green to-brand-gray bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              CIS Web Compliance
            </Link>
          </div>
        </div>
        
        {/* Right side - External link and Auth */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
            <a 
              href="https://smartedge.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>SmartEdge.in</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
                <Link to="/profile" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-brand-green/20 hover:bg-brand-green/10 hover:text-brand-green hover:border-brand-green/40 transition-all"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" asChild className="bg-brand-green hover:bg-brand-green/90 text-white">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
