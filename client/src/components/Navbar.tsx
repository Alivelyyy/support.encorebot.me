import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Ticket, LogOut, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  userName?: string;
  isAdmin?: boolean;
  onLogout?: () => void;
  onCreateTicket?: () => void;
  onViewDashboard?: () => void;
  onToggleSidebar?: () => void;
}

export default function Navbar({ 
  userName, 
  isAdmin, 
  onLogout,
  onCreateTicket,
  onViewDashboard,
  onToggleSidebar
}: NavbarProps) {
  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onToggleSidebar}
              data-testid="button-sidebar-toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-chart-2">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-lg" data-testid="text-brand">
                Support Center
              </h1>
              <p className="text-xs text-muted-foreground">
                EncoreBot & Team Epic
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCreateTicket && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onCreateTicket}
              className="hidden md:flex gap-2"
              data-testid="button-new-ticket"
            >
              <Ticket className="h-4 w-4" />
              New Ticket
            </Button>
          )}
          
          {userName && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full"
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none" data-testid="text-username">
                      {userName}
                    </p>
                    {isAdmin && (
                      <p className="text-xs leading-none text-muted-foreground">
                        Admin
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && onViewDashboard && (
                  <DropdownMenuItem onClick={onViewDashboard} data-testid="menu-dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onLogout} data-testid="menu-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
