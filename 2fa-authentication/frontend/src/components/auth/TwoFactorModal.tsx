import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield } from 'lucide-react';

interface TwoFactorModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function TwoFactorModal({
  open,
  onClose,
  onVerify,
  isLoading,
  error,
}: TwoFactorModalProps) {
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      await onVerify(code);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center">Two-Factor Authentication</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 6-digit code sent to your Telegram
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="text-center text-2xl tracking-widest font-mono"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
