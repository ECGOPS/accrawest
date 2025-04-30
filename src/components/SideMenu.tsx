import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Upload,
  Workflow,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  AlertCircle,
  BarChart2,
  Map,
  Folder,
  Users2,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface SideMenuProps {
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onCollapseChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/monitoring', icon: AlertCircle, label: 'Real-Time Monitoring' },
    { path: '/analysis', icon: Users, label: 'Customer Analysis' },
    { path: '/reports', icon: BarChart2, label: 'Reports' },
    { path: '/cases', icon: FileText, label: 'Case Management' },
    { path: '/workflow', icon: Workflow, label: 'Workflow' },
    { path: '/documents', icon: Folder, label: 'Documents' },
    { path: '/team', icon: Users2, label: 'Team' },
  ];

  const renderMenuItems = () => (
    <div className="space-y-1 py-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center w-full min-h-[44px] transition-all duration-300',
              isActive
                ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm'
                : 'hover:bg-muted/30 text-muted-foreground hover:text-foreground border-l-4 border-transparent',
              isCollapsed ? 'justify-center px-2' : 'px-4 py-2'
            )}
            title={isCollapsed ? item.label : ''}
          >
            <Icon className={cn(
              "transition-all duration-300 shrink-0",
              isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
            )} />
            {!isCollapsed && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className={cn(
      "h-full bg-background border-r flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 overflow-hidden">
            <LayoutDashboard className="h-6 w-6 text-primary shrink-0" />
            <span className="font-semibold text-lg truncate">ECG Fraud Alert</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {renderMenuItems()}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-2 shrink-0">
        <Link
          to="/settings"
          className={cn(
            'flex items-center w-full min-h-[44px] transition-all duration-300',
            location.pathname === '/settings'
              ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm'
              : 'hover:bg-muted/30 text-muted-foreground hover:text-foreground border-l-4 border-transparent',
            isCollapsed ? 'justify-center px-2' : 'px-4 py-2'
          )}
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings className={cn(
            "transition-all duration-300 shrink-0",
            isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
          )} />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center w-full min-h-[44px] transition-all duration-300',
            'hover:bg-red-50 text-red-500 hover:text-red-600 border-l-4 border-transparent',
            isCollapsed ? 'justify-center px-2' : 'px-4 py-2'
          )}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <LogOut className={cn(
            "transition-all duration-300 shrink-0",
            isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
          )} />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default SideMenu; 