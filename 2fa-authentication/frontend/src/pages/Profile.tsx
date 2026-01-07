import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Key, User, MessageCircle, Send } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  // 2FA State
  const [telegramChatId, setTelegramChatId] = useState(user?.telegram_chat_id || '');
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is_2fa_enabled || false);
  const [isToggling2FA, setIsToggling2FA] = useState(false);
  const [isTesting2FA, setIsTesting2FA] = useState(false);
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handle2FAToggle = async () => {
    setIsToggling2FA(true);
    try {
      if (is2FAEnabled) {
        await api.disable2FA();
        setIs2FAEnabled(false);
        toast({ title: '2FA Disabled', description: 'Two-factor authentication has been disabled.' });
      } else {
        if (!telegramChatId.trim()) {
          toast({
            title: 'Error',
            description: 'Please enter your Telegram Chat ID first.',
            variant: 'destructive',
          });
          return;
        }
        await api.enable2FA(telegramChatId);
        setIs2FAEnabled(true);
        toast({ title: '2FA Enabled', description: 'Two-factor authentication is now active.' });
      }
      await refreshUser();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update 2FA settings',
        variant: 'destructive',
      });
    } finally {
      setIsToggling2FA(false);
    }
  };

  const handleTest2FA = async () => {
    setIsTesting2FA(true);
    try {
      await api.test2FA();
      toast({
        title: 'Test Code Sent',
        description: 'Check your Telegram for the test code.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test code',
        variant: 'destructive',
      });
    } finally {
      setIsTesting2FA(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      toast({ title: 'Password Changed', description: 'Your password has been updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and security
          </p>
        </div>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full gradient-bg flex items-center justify-center shadow-glow">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.username}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getRoleBadgeVariant(user?.role || 'user') as any}>
                      {user?.role}
                    </Badge>
                    {user?.is_2fa_enabled && (
                      <Badge variant="success">
                        <Shield className="h-3 w-3 mr-1" />
                        2FA
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                Member since {user?.created_at && format(new Date(user.created_at), 'MMMM d, yyyy')}
              </div>
            </CardContent>
          </Card>

          {/* 2FA Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Secure your account with Telegram-based 2FA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when signing in
                  </p>
                </div>
                <Switch
                  checked={is2FAEnabled}
                  onCheckedChange={handle2FAToggle}
                  disabled={isToggling2FA || (!is2FAEnabled && !telegramChatId.trim())}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegram-id" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Telegram Chat ID
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="telegram-id"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="Enter your Telegram Chat ID"
                      disabled={is2FAEnabled}
                    />
                    {is2FAEnabled && (
                      <Button
                        variant="outline"
                        onClick={handleTest2FA}
                        disabled={isTesting2FA}
                      >
                        {isTesting2FA ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Test
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                  <p className="font-medium">How to get your Telegram Chat ID:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Open Telegram and search for <strong>@userinfobot</strong></li>
                    <li>Start a conversation with the bot</li>
                    <li>The bot will reply with your Chat ID</li>
                    <li>Copy and paste the ID above</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isChangingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                >
                  {isChangingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
