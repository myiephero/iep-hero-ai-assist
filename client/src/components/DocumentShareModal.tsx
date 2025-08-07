import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Share2, Lock, Timer, Eye, Download, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    displayName: string;
    type: string;
    description?: string;
  };
}

export function DocumentShareModal({ isOpen, onClose, document }: DocumentShareModalProps) {
  const { toast } = useToast();
  const [shareData, setShareData] = useState({
    recipientEmail: "",
    accessLevel: "view",
    expiresIn: 7,
    maxViews: "",
    requiresPassword: false,
    password: "",
  });
  const [shareResult, setShareResult] = useState<{
    shareUrl: string;
    token: string;
    expiresAt: string;
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateShare = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/documents/${document.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shareData,
          maxViews: shareData.maxViews ? parseInt(shareData.maxViews) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create share link");
      }

      const result = await response.json();
      setShareResult(result);
      
      toast({
        title: "Share link created",
        description: "Secure link generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create share link",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    if (shareResult?.shareUrl) {
      await navigator.clipboard.writeText(shareResult.shareUrl);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      });
    }
  };

  const handleClose = () => {
    setShareResult(null);
    setShareData({
      recipientEmail: "",
      accessLevel: "view",
      expiresIn: 7,
      maxViews: "",
      requiresPassword: false,
      password: "",
    });
    onClose();
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case "view": return <Eye className="w-4 h-4" />;
      case "download": return <Download className="w-4 h-4" />;
      case "comment": return <Users className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            Share Document: {document.displayName}
          </DialogTitle>
        </DialogHeader>

        {!shareResult ? (
          <div className="space-y-6 py-4">
            {/* Recipient Email */}
            <div className="space-y-2">
              <Label htmlFor="recipientEmail" className="text-slate-200">
                Recipient Email (Optional)
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@example.com"
                value={shareData.recipientEmail}
                onChange={(e) => setShareData({ ...shareData, recipientEmail: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

            {/* Access Level */}
            <div className="space-y-2">
              <Label className="text-slate-200">Access Level</Label>
              <Select
                value={shareData.accessLevel}
                onValueChange={(value) => setShareData({ ...shareData, accessLevel: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="view" className="text-white">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Only
                    </div>
                  </SelectItem>
                  <SelectItem value="download" className="text-white">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      View & Download
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <Label className="text-slate-200 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Expires in (days)
              </Label>
              <Select
                value={shareData.expiresIn.toString()}
                onValueChange={(value) => setShareData({ ...shareData, expiresIn: parseInt(value) })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="1" className="text-white">1 day</SelectItem>
                  <SelectItem value="3" className="text-white">3 days</SelectItem>
                  <SelectItem value="7" className="text-white">1 week</SelectItem>
                  <SelectItem value="30" className="text-white">1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Limit */}
            <div className="space-y-2">
              <Label htmlFor="maxViews" className="text-slate-200">
                Maximum Views (Optional)
              </Label>
              <Input
                id="maxViews"
                type="number"
                placeholder="Unlimited"
                value={shareData.maxViews}
                onChange={(e) => setShareData({ ...shareData, maxViews: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

            {/* Password Protection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresPassword"
                  checked={shareData.requiresPassword}
                  onCheckedChange={(checked) => 
                    setShareData({ ...shareData, requiresPassword: checked, password: checked ? shareData.password : "" })
                  }
                />
                <Label htmlFor="requiresPassword" className="text-slate-200 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password Protection
                </Label>
              </div>

              {shareData.requiresPassword && (
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={shareData.password}
                  onChange={(e) => setShareData({ ...shareData, password: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="text-green-300 font-semibold mb-2">Share Link Created Successfully</div>
              <div className="text-sm text-green-200">
                Link expires: {new Date(shareResult.expiresAt).toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Secure Share URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareResult.shareUrl}
                  className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
                />
                <Button onClick={handleCopyLink} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-slate-800 rounded-lg space-y-2">
              <div className="text-sm text-slate-300">
                <strong>Access Level:</strong> {shareData.accessLevel}
              </div>
              <div className="text-sm text-slate-300">
                <strong>Password Protected:</strong> {shareData.requiresPassword ? "Yes" : "No"}
              </div>
              {shareData.maxViews && (
                <div className="text-sm text-slate-300">
                  <strong>View Limit:</strong> {shareData.maxViews} views
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleClose} variant="outline" className="border-slate-600 text-slate-200">
            {shareResult ? "Close" : "Cancel"}
          </Button>
          {!shareResult && (
            <Button 
              onClick={handleCreateShare} 
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? "Creating..." : "Create Share Link"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}