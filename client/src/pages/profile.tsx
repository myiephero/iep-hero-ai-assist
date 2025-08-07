import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Eye, EyeOff, Crown, Star, Shield, User } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/change-password', passwordData);
      toast({
        title: "Success",
        description: "Password changed successfully"
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'heroOffer': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'free': return 'bg-slate-500';
      default: return 'bg-blue-500';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'heroOffer': return <Crown className="h-4 w-4" />;
      case 'free': return <User className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'advocate': return <Shield className="h-5 w-5 text-amber-400" />;
      case 'parent': return <User className="h-5 w-5 text-blue-400" />;
      default: return <User className="h-5 w-5 text-slate-400" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile & Settings</h1>
          <p className="text-slate-400">Manage your account settings and subscription</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getRoleIcon(user.role)}
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Email</Label>
                <div className="mt-1 p-2 bg-slate-700 rounded-md text-white">
                  {user.email}
                </div>
              </div>
              
              <div>
                <Label className="text-slate-300">Username</Label>
                <div className="mt-1 p-2 bg-slate-700 rounded-md text-white">
                  {user.username}
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Role</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-white border-slate-600 capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-slate-300">User ID</Label>
                <div className="mt-1 p-2 bg-slate-700 rounded-md text-xs text-slate-400 font-mono">
                  {user.id}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plan */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Subscription Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Current Plan</Label>
                <div className="mt-2">
                  <Badge className={`${getPlanColor(user.planStatus)} text-white flex items-center gap-1 w-fit`}>
                    {getPlanIcon(user.planStatus)}
                    {user.planStatus === 'heroOffer' ? 'Hero Plan' : 
                     user.planStatus === 'free' ? 'Free Plan' : 
                     user.planStatus || 'Free Plan'}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg">
                {user.planStatus === 'free' ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Upgrade to Hero Plan</h4>
                    <p className="text-sm text-slate-300">
                      Unlock advanced AI tools, unlimited document analysis, and professional advocacy features.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setLocation('/pricing')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        View Pricing
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setLocation('/subscribe')}
                        className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                      >
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      Hero Plan Active
                    </h4>
                    <p className="text-sm text-slate-300">
                      You have access to all premium features including AI-powered tools, unlimited document analysis, and priority support.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <Button 
                  onClick={() => setIsChangingPassword(true)}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Current Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">New Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handlePasswordChange} size="sm">
                      Update Password
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Development Info */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  🔧 Developer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-slate-400">
                  <div><strong>Session ID:</strong> {user.id}</div>
                  <div><strong>Auth Provider:</strong> Local/Demo</div>
                  <div><strong>Subscription Tier:</strong> {user.subscriptionTier || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}