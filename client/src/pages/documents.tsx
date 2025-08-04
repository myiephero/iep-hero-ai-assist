import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FileUploadModal from "@/components/modals/file-upload-modal";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Document } from "@shared/schema";
import Footer from "@/components/layout/footer";

export default function Documents() {
  const [showFileUpload, setShowFileUpload] = useState(false);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "iep":
        return "bg-blue-100 text-blue-800";
      case "assessment":
        return "bg-green-100 text-green-800";
      case "progress_report":
        return "bg-yellow-100 text-yellow-800";
      case "meeting_notes":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "iep":
        return "IEP Document";
      case "assessment":
        return "Assessment Report";
      case "progress_report":
        return "Progress Report";
      case "meeting_notes":
        return "Meeting Notes";
      default:
        return "Other";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your IEP documents and files
                </p>
              </div>
              <Button onClick={() => setShowFileUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Documents Grid */}
          {documents.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No documents found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload your first IEP document to get started
                  </p>
                  <Button onClick={() => setShowFileUpload(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document: Document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {document.originalName}
                          </h3>
                        </div>
                      </div>
                      <Badge className={getDocumentTypeColor(document.type)}>
                        {getDocumentTypeLabel(document.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {document.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {document.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mb-4">
                      Uploaded {format(new Date(document.uploadedAt), "MMM d, yyyy")}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <FileUploadModal 
        open={showFileUpload} 
        onOpenChange={setShowFileUpload}
      />
      
      <Footer />
    </div>
  );
}
