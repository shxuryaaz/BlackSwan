import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  Phone, 
  Trash2, 
  Edit,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Calendar
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCustomers, deleteCustomer, addReminder, addCustomer, updateCustomer, calculateCustomerStatus, calculateCustomerRiskLevel } from "@/integrations/firebase/database";
import { signOutUser } from "@/integrations/firebase/auth";
import { sendReminder } from "@/integrations/firebase/services";
import ImportCustomers from "@/components/customers/ImportCustomers";
import type { User } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";

interface CustomersProps {
  user: User;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  amount_due: number;
  due_date: string;
  status: string;
  risk_level: string;
  notes?: string;
}

const Customers = ({ user }: CustomersProps) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    amount_due: 0,
    due_date: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, [user.uid]);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers(user.uid);
      // Process customers to update status and risk level
      const processedCustomers = await processCustomerStatusAndRisk(data as Customer[]);
      setCustomers(processedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error loading customers",
        description: "Failed to load customer data. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate and update customer status and risk level
  const processCustomerStatusAndRisk = async (customerList: Customer[]) => {
    const updatedCustomers = [];

    for (const customer of customerList) {
      const newStatus = calculateCustomerStatus(customer.due_date, customer.status);
      const newRiskLevel = calculateCustomerRiskLevel(customer.due_date, customer.amount_due, customer.status);

      // Update customer in database if status or risk level changed
      if (newStatus !== customer.status || newRiskLevel !== customer.risk_level) {
        try {
          await updateCustomer(customer.id, {
            status: newStatus,
            risk_level: newRiskLevel
          });
        } catch (error) {
          console.error('Error updating customer status:', error);
        }
      }

      updatedCustomers.push({
        ...customer,
        status: newStatus,
        risk_level: newRiskLevel
      });
    }

    return updatedCustomers;
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      await fetchCustomers(); // Refresh the list
      toast({
        title: "Customer deleted",
        description: "Customer has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error deleting customer",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.amount_due || !newCustomer.due_date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (name, email, amount, due date).",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCustomer({
        user_id: user.uid,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone || undefined,
        company: newCustomer.company || undefined,
        amount_due: parseFloat(newCustomer.amount_due.toString()),
        due_date: newCustomer.due_date,
        notes: newCustomer.notes || undefined,
        status: 'pending',
        risk_level: 'low'
      });

      // Reset form
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        company: "",
        amount_due: 0,
        due_date: "",
        notes: ""
      });
      setShowAddDialog(false);
      await fetchCustomers(); // Refresh the list

      toast({
        title: "Customer added",
        description: "Customer has been successfully added.",
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error adding customer",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendReminder = async (customer: Customer, channels: string[]) => {
    try {
      // Send reminder through selected channels
      const results = await sendReminder(user.uid, customer, channels);
      
      // Create reminder record in database
      await addReminder({
        user_id: user.uid,
        customer_id: customer.id,
        type: channels[0], // Primary channel
        status: 'sent',
        message_content: `Payment reminder sent to ${customer.name}`,
        channels: channels,
        ai_tone: 'professional',
        sent_at: new Date().toISOString()
      });

      toast({
        title: "Reminder sent",
        description: `Payment reminder sent to ${customer.name} via ${channels.join(', ')}.`,
      });

      console.log('Reminder sent:', results);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error sending reminder",
        description: "Failed to send reminder. Please check your API settings.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
      paid: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      overdue: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} font-semibold`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      medium: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
      high: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
    };

    return (
      <Badge className={`${colors[risk as keyof typeof colors]} font-semibold`}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    );
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesRisk = riskFilter === "all" || customer.risk_level === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  // Calculate stats with real-time overdue calculation
  const totalCustomers = customers.length;
  const totalOutstanding = customers.reduce((sum, c) => sum + c.amount_due, 0);
  const overdueCustomers = customers.filter(c => {
    const dueDate = new Date(c.due_date);
    const today = new Date();
    return dueDate < today && c.status !== 'paid';
  }).length;
  const paidCustomers = customers.filter(c => c.status === 'paid').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading customers...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-accent to-accent/80 rounded-xl">
              <Users className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Customer Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your customers and send payment reminders across multiple channels.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">${totalOutstanding.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{overdueCustomers}</p>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{paidCustomers}</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions Bar */}
        <Card className="card-premium mb-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span>Customers ({filteredCustomers.length})</span>
                </CardTitle>
                <CardDescription>Manage and communicate with your customers</CardDescription>
              </div>
              <div className="flex space-x-3">
                <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 border-border/50 hover:border-accent/50">
                      <Plus className="h-4 w-4" />
                      <span>Import</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Import Customers</DialogTitle>
                      <DialogDescription>
                        Upload a CSV or Excel file to import customer data.
                      </DialogDescription>
                    </DialogHeader>
                    <ImportCustomers 
                      user={user} 
                      onImportComplete={() => {
                        setShowImportDialog(false);
                        fetchCustomers();
                      }} 
                    />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="btn-accent flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Customer</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                      <DialogDescription>
                        Enter customer information to add them to your system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                          placeholder="Customer name"
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                          placeholder="customer@example.com"
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                          placeholder="+1-555-0123"
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={newCustomer.company}
                          onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                          placeholder="Company name"
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount Due *</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={newCustomer.amount_due}
                          onChange={(e) => setNewCustomer({...newCustomer, amount_due: parseFloat(e.target.value) || 0})}
                          placeholder="0.00"
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <Label htmlFor="due-date">Due Date *</Label>
                        <Input
                          id="due-date"
                          type="date"
                          value={newCustomer.due_date}
                          onChange={(e) => setNewCustomer({...newCustomer, due_date: e.target.value})}
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newCustomer.notes}
                          onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                          placeholder="Additional notes about this customer"
                          rows={3}
                          className="input-premium"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddCustomer} className="btn-accent">
                          Add Customer
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-premium pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="input-premium w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="input-premium w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card className="table-premium animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardContent className="p-0">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-3">No customers found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {customers.length === 0 
                    ? "Get started by importing your customer data or adding customers manually."
                    : "Try adjusting your search or filters."
                  }
                </p>
                {customers.length === 0 && (
                  <div className="flex justify-center space-x-3">
                    <Button onClick={() => setShowImportDialog(true)} className="btn-accent">
                      Import Customers
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddDialog(true)}>
                      Add Customer
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-6 font-semibold text-foreground/80">Customer</th>
                      <th className="text-left p-6 font-semibold text-foreground/80">Amount Due</th>
                      <th className="text-left p-6 font-semibold text-foreground/80">Due Date</th>
                      <th className="text-left p-6 font-semibold text-foreground/80">Status</th>
                      <th className="text-left p-6 font-semibold text-foreground/80">Risk</th>
                      <th className="text-left p-6 font-semibold text-foreground/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors duration-200">
                        <td className="p-6">
                          <div>
                            <p className="font-semibold text-foreground">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            {customer.company && (
                              <p className="text-xs text-muted-foreground">{customer.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="font-bold text-accent">${customer.amount_due.toFixed(2)}</span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(customer.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          {getStatusBadge(customer.status)}
                        </td>
                        <td className="p-6">
                          {getRiskBadge(customer.risk_level)}
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(customer, ['email'])}
                              className="border-border/50 hover:border-accent/50 hover:bg-accent/5"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(customer, ['whatsapp'])}
                              className="border-border/50 hover:border-accent/50 hover:bg-accent/5"
                            >
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(customer, ['voice'])}
                              className="border-border/50 hover:border-accent/50 hover:bg-accent/5"
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border/50 hover:border-accent/50 hover:bg-accent/5"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="border-border/50 hover:border-red-500/50 hover:bg-red-500/5"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Customers;