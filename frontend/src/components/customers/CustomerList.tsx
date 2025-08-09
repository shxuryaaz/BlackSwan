import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, MessageSquare, Phone, Edit, Trash2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue" | "paid";
  riskLevel: "low" | "medium" | "high";
  lastContact?: string;
}

interface CustomerListProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onSendReminder: (customerId: string, type: "email" | "whatsapp" | "voice") => void;
}

const CustomerList = ({ 
  customers, 
  onAddCustomer, 
  onEditCustomer, 
  onDeleteCustomer, 
  onSendReminder 
}: CustomerListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
              pending: "bg-blackswan-gray-medium text-foreground",
      overdue: "bg-destructive text-destructive-foreground",
      paid: "bg-green-100 text-green-800"
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-accent text-accent-foreground"
    };

    return (
      <Badge variant="outline" className={colors[riskLevel as keyof typeof colors]}>
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </Badge>
    );
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle>Customer Management</CardTitle>
          <Button onClick={onAddCustomer} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No customers found</p>
            <p className="text-sm">Add customers to start managing payment reminders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 border border-blackswan-gray-medium rounded-lg hover:shadow-elegant transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground">{customer.name}</h3>
                      {getStatusBadge(customer.status)}
                      {getRiskBadge(customer.riskLevel)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-sm text-muted-foreground mb-1">{customer.phone}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-medium">
                        Amount: <span className="text-accent">${customer.amount.toLocaleString()}</span>
                      </span>
                      <span className={`font-medium ${isOverdue(customer.dueDate) ? 'text-destructive' : 'text-muted-foreground'}`}>
                        Due: {new Date(customer.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {customer.lastContact && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last contact: {customer.lastContact}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendReminder(customer.id, "email")}
                      className="flex items-center space-x-1"
                    >
                      <Mail className="h-3 w-3" />
                      <span>Email</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendReminder(customer.id, "whatsapp")}
                      className="flex items-center space-x-1"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>WhatsApp</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendReminder(customer.id, "voice")}
                      className="flex items-center space-x-1"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Call</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditCustomer(customer)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="flex items-center space-x-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerList;