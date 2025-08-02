import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Link } from "wouter";
import type { User } from "../../../shared/schema";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth() as { isAuthenticated: boolean; user: User | undefined };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">IEP Advocacy</h1>
            </Link>
          </div>
          
          {!isAuthenticated && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#services" className="text-neutral hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</a>
                <a href="#pricing" className="text-neutral hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
                <a href="#about" className="text-neutral hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                <a href="#contact" className="text-neutral hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral">
                  Welcome, {user?.firstName || user?.email}
                </span>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => window.location.href = "/api/login"}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
