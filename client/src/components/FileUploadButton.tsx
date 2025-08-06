import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText } from "lucide-react";

interface FileUploadButtonProps {
  onUploadComplete?: (file: any) => void;
  acceptedTypes?: string;
  buttonText?: string;
  className?: string;
}

export function FileUploadButton({ 
  onUploadComplete,
  acceptedTypes = ".pdf,.doc,.docx",
  buttonText = "Upload File",
  className
}: FileUploadButtonProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", "other");
      formData.append("description", `Uploaded via ${buttonText}`);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      setSelectedFile(null);
      onUploadComplete?.(result);
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = acceptedTypes.split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Only ${allowedTypes.join(', ')} files are allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    uploadMutation.mutate(file);
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
        disabled={uploadMutation.isPending}
      />
      <Label htmlFor="file-upload-input">
        <Button 
          variant="outline" 
          className={`cursor-pointer ${className}`}
          disabled={uploadMutation.isPending}
          asChild
        >
          <span>
            {uploadMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {buttonText}
              </>
            )}
          </span>
        </Button>
      </Label>
      
      {selectedFile && !uploadMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{selectedFile.name}</span>
        </div>
      )}
    </div>
  );
}