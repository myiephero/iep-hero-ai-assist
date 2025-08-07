import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAwareDashboard } from "@/utils/navigation";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Shield,
  FileText,
  Users,
  Heart,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const { getDashboardRoute } = useRoleAwareDashboard();

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">My IEP Hero</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering families with comprehensive IEP management tools, 
              advocacy support, and AI-powered insights for special education success.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/myiephero" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/myiephero" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/myiephero" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/myiephero" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={getDashboardRoute()} className="text-gray-300 hover:text-white transition-colors flex items-center">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/goals" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  IEP Goals
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Hero Plan
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/guides" className="text-gray-300 hover:text-white transition-colors">
                  IEP Guides
                </a>
              </li>
              <li>
                <a href="/advocacy" className="text-gray-300 hover:text-white transition-colors">
                  Find an Advocate
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  Blog
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="/webinars" className="text-gray-300 hover:text-white transition-colors">
                  Free Webinars
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:support@myiephero.com" className="hover:text-white transition-colors">
                  support@myiephero.com
                </a>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                <a href="tel:+1-855-IEP-HERO" className="hover:text-white transition-colors">
                  1-855-IEP-HERO
                </a>
              </li>
              <li className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                <span>
                  123 Education Lane<br />
                  Special Needs, CA 90210
                </span>
              </li>
            </ul>
            
            {/* Legal Links */}
            <div className="pt-4 border-t border-gray-700">
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} My IEP Hero. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-400" />
                Made with love for special needs families
              </span>
              <div className="flex items-center space-x-4">
                <a href="/status" className="hover:text-white transition-colors">
                  System Status
                </a>
                <a href="/api-docs" className="hover:text-white transition-colors">
                  API
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}