import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FileText, Download, Upload, Eye, Plus } from "lucide-react";

export default function Documents() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Document Library
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage all your IEP-related documents in one secure place
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Document Categories */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "Current IEP",
                      "Evaluations",
                      "Progress Reports", 
                      "Medical Records",
                      "School Communications",
                      "Advocacy Letters"
                    ].map(category => (
                      <Button key={category} variant="ghost" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        {category}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {[
                  { name: "Current IEP - 2024-2025", type: "PDF", date: "Sep 15, 2024", category: "Current IEP" },
                  { name: "Psychological Evaluation", type: "PDF", date: "Aug 22, 2024", category: "Evaluations" },
                  { name: "Q1 Progress Report", type: "PDF", date: "Nov 1, 2024", category: "Progress Reports" },
                  { name: "Speech Therapy Assessment", type: "PDF", date: "Oct 10, 2024", category: "Evaluations" },
                  { name: "Teacher Communication Log", type: "DOC", date: "Dec 1, 2024", category: "Communications" }
                ].map((doc, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-medium">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {doc.category} • {doc.type} • {doc.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}