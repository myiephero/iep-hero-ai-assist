import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Plus, Users, Calendar, FileText, User, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

const addClientSchema = z.object({
  parentEmail: z.string().email("Please enter a valid email address"),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type AddClientFormData = z.infer<typeof addClientSchema>;

export default function MyParentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<AddClientFormData>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      parentEmail: "",
      clientName: "",
      phone: "",
      notes: "",
    },
  });

  // Query for advocate clients
  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/advocate/clients"],
    enabled: !!user,
  });

  // Mutation to add new client
  const addClientMutation = useMutation({
    mutationFn: async (data: AddClientFormData) => {
      const response = await apiRequest("POST", "/api/advocate/clients", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add client");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client added successfully",
      });
      setShowAddClient(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/advocate/clients"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    },
  });

  const filteredClients = clients.filter((client: any) =>
    client.parent?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.parent?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: AddClientFormData) => {
    addClientMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Parent Clients</h1>
              <p className="text-slate-300">
                Manage your advocacy cases and client relationships
              </p>
            </div>
            <Button
              onClick={() => setShowAddClient(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Client
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search clients by name, email, or student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#3E4161]/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Client Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {searchTerm ? 'No clients found' : 'No clients yet'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm 
                  ? `No clients match "${searchTerm}". Try a different search term.`
                  : 'Start building your advocacy practice by adding your first client'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowAddClient(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Client
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client: any) => (
              <Card key={client.id} className="bg-[#3E4161] border-slate-600 hover:bg-[#4A4E76] transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {client.clientName || client.parent?.username || 'Unknown Client'}
                        </h3>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Active Case
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Mail className="w-4 h-4" />
                      {client.parent?.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone className="w-4 h-4" />
                        {client.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">
                      <strong>Students ({client.students?.length || 0})</strong>
                    </div>
                    {client.students?.slice(0, 2).map((student: any) => (
                      <div key={student.id} className="text-sm text-slate-300">
                        {student.firstName} {student.lastName} - Grade {student.grade} at {student.school || 'Unknown School'}
                      </div>
                    ))}
                    {(client.students?.length || 0) > 2 && (
                      <div className="text-sm text-slate-400">
                        +{client.students.length - 2} more students
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                    <div className="text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last contact: {client.lastContactDate ? new Date(client.lastContactDate).toLocaleDateString() : 'Never'}
                      </div>
                      {client.nextMeetingDate && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          Next meeting: {new Date(client.nextMeetingDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <FileText className="w-3 h-3" />
                      {client.documentsCount || 0} Documents
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-slate-500 text-white hover:bg-slate-700"
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent className="bg-[#3E4161] border-slate-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Add New Client</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Client Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter client's preferred name"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Parent Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="parent@example.com"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(555) 123-4567"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Initial Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Case notes, special considerations..."
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddClient(false)}
                  className="flex-1 border-slate-500"
                  disabled={addClientMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={addClientMutation.isPending}
                >
                  {addClientMutation.isPending ? "Adding..." : "Add Client"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}