import { Link, useLocation } from "wouter";
import { Bell, GraduationCap, Menu, User, Sparkles, Target, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { PlanStatusBadge } from "@/components/PlanStatusBadge";

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
  const [location] = useLocation();
  
  const { user } = useAuth();
  
  // Dynamic nav items based on user plan
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Sparkles },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/documents", label: "Documents", icon: FileText },
    // Only show Subscribe for free plan users
    ...(user?.planStatus === 'free' ? [{ href: "/subscribe", label: "Subscribe", icon: CreditCard }] : [])
  ];

  const linkClass = mobile 
    ? "flex items-center gap-3 py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
    : "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 backdrop-blur-sm";

  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <a 
              className={`${linkClass} ${
                isActive
                  ? "bg-white/20 text-white shadow-lg border border-white/30" 
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </a>
          </Link>
        );
      })}
    </>
  );
};

const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.username || user.email} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {(user.username || user.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-lg border-white/20" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-3">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-gray-900">{user.username || "User"}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
            <div className="mt-2">
              <PlanStatusBadge planStatus={user.planStatus} size="sm" />
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-gray-700 hover:bg-gray-100">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Navbar() {
  const { user } = useAuth();
  
  return (
    <nav className="bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <Link href="/dashboard">
                <a className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  IEP Hero
                </a>
              </Link>
              {user?.planStatus === 'heroOffer' && (
                <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                  HERO
                </Badge>
              )}
            </div>
            <div className="hidden md:flex ml-8 space-x-2">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:block">
              <UserMenu />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white/80 hover:text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-br from-purple-900 to-blue-900 border-l border-white/10">
                <div className="mt-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-white">IEP Hero</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <NavLinks mobile />
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <UserMenu />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
