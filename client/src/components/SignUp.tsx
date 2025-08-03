import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserIcon, BriefcaseIcon, ShieldCheckIcon } from 'lucide-react';

const roles = [
  {
    label: 'Parent',
    description: "Get expert support for your child's IEP journey",
    badge: 'Free to Join',
    icon: <UserIcon className="h-5 w-5 text-blue-500" />,
    value: 'parent',
  },
  {
    label: 'Advocate',
    description: 'Help families navigate special education',
    badge: 'Apply Now',
    icon: <BriefcaseIcon className="h-5 w-5 text-green-500" />,
    value: 'advocate',
  },
  {
    label: 'Administrator',
    description: 'Manage platform and user oversight',
    badge: 'Invite Only',
    icon: <ShieldCheckIcon className="h-5 w-5 text-indigo-500" />,
    value: 'admin',
  },
];

export default function SignUp() {
  const [selected, setSelected] = useState('parent');

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto">
      <div className="max-w-lg mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
          My IEP Hero
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          Connect with expert advocates, get AI-powered IEP analysis,
          and ensure your child receives the educational support they deserve.
        </p>
        <div className="mt-6 flex gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-transform duration-100 active:scale-95">
            Get Started Today
          </Button>
          <Button variant="outline">Learn More</Button>
        </div>
        <div className="mt-6 flex space-x-4 text-sm text-green-600">
          <span className="before:content-['•'] before:mr-1">FERPA Compliant</span>
          <span className="before:content-['•'] before:mr-1">Secure & Encrypted</span>
          <span className="before:content-['•'] before:mr-1">Expert Support</span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center space-x-4 mb-6">
          <Button variant="ghost">Sign In</Button>
          <Button variant="ghost" className="border-b-2 border-blue-500 rounded-none">Sign Up</Button>
        </div>

        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Account</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Join My IEP Hero and get the support you need
          </p>

          <div className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.value}
                className={cn(
                  'w-full text-left border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95',
                  selected === role.value && 'border-blue-500 bg-blue-50'
                )}
                onClick={() => setSelected(role.value)}
              >
                <div className="flex items-center gap-3">
                  {role.icon}
                  <div>
                    <div className="font-medium text-sm">{role.label}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-green-200 text-green-700 px-2 py-1 rounded-full">
                  {role.badge}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}