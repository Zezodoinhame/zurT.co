import { Menu, UserCircle, LogOut, Moon, Sun, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

interface TopBarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  hideSearch?: boolean;
  title?: string;
  subtitle?: string;
}

const TopBar = ({ onMenuClick, showMenuButton = false, hideSearch = false, title, subtitle }: TopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('layout');
  const { theme, toggleTheme } = useTheme();

  const getAbbreviatedName = () => {
    if (!user?.full_name) return '';
    const names = user.full_name.trim().split(' ');
    if (names.length >= 2) return `${names[0]} ${names[names.length - 1][0]}.`;
    return names[0];
  };

  const getUserInitials = () => {
    if (!user?.full_name) return 'U';
    const names = user.full_name.trim().split(' ');
    if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    return user.full_name[0].toUpperCase();
  };

  const getSettingsPath = () => {
    if (!user) return '/app/settings';
    switch (user.role) {
      case 'consultant': return '/consultant/settings';
      case 'admin': return '/admin/settings';
      default: return '/app/settings';
    }
  };

  const handleLogout = () => { logout(); };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {title && (
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-foreground tracking-tight">{title}</h1>
            {subtitle && (
              <>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-sm text-muted-foreground">{subtitle}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </Button>

        <NotificationDropdown />

        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted/50 transition-colors focus-visible:outline-none"
                aria-label={t('topbar.openAccountMenu')}
              >
                {/* Avatar with initials */}
                <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary leading-none">{getUserInitials()}</span>
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[120px] truncate">
                  {getAbbreviatedName() || t('topbar.accountFallback')}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-foreground">{user.full_name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(getSettingsPath())}>
                <UserCircle className="h-4 w-4 mr-2" />
                {t('topbar.myProfile')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                {t('topbar.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default TopBar;
