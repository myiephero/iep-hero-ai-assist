import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, Briefcase, Shield } from "lucide-react";

interface AuthRoleSelectProps {
  onRoleSelect: (role: 'parent' | 'advocate' | 'administrator') => void;
}

export function AuthRoleSelect({ onRoleSelect }: AuthRoleSelectProps) {
  const roles = [
    {
      id: 'parent' as const,
      title: 'Parent',
      description: 'Get support for your child\'s IEP journey',
      icon: Users,
      badge: 'Free to Join',
      badgeVariant: 'default' as const,
      gradient: 'from-primary to-primary/80'
    },
    {
      id: 'advocate' as const,
      title: 'Advocate',
      description: 'Professional IEP advocacy services',
      icon: Briefcase,
      badge: 'Apply Now',
      badgeVariant: 'secondary' as const,
      gradient: 'from-secondary to-secondary/80'
    },
    {
      id: 'administrator' as const,
      title: 'Administrator',
      description: 'Manage and oversee advocacy programs',
      icon: Shield,
      badge: 'Invite Only',
      badgeVariant: 'outline' as const,
      gradient: 'from-muted-foreground to-muted-foreground/80'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-muted-foreground">Join My IEP Hero and connect with the support you need</p>
      </div>
      
      <div className="grid gap-4">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <Card 
              key={role.id}
              className="relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
              onClick={() => onRoleSelect(role.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-5 rounded-lg`}></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${role.gradient} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{role.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <Badge variant={role.badgeVariant} className="text-xs">
                    {role.badge}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}