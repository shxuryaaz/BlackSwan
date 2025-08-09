import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { batchAddCustomers, calculateCustomerStatus, calculateCustomerRiskLevel } from "@/integrations/firebase/database";
import type { User } from 'firebase/auth';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ImportCustomersProps {
  user: User;
  onImportComplete: () => void;
}

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  amount_due: number;
  due_date: string;
  notes?: string;
}

const ImportCustomers = ({ user, onImportComplete }: ImportCustomersProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CustomerData[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setError("");
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: CustomerData[] = [];

        if (selectedFile.name.endsWith('.csv')) {
          // Parse CSV
          Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              data = results.data as CustomerData[];
              validateAndSetPreview(data);
            },
            error: (error) => {
              setError(`Error parsing CSV: ${error.message}`);
            }
          });
        } else if (selectedFile.name.match(/\.(xlsx|xls)$/)) {
          // Parse Excel
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          data = jsonData as CustomerData[];
          validateAndSetPreview(data);
        } else {
          setError("Unsupported file format. Please use CSV or Excel files.");
        }
      } catch (err) {
        setError("Error reading file. Please check the file format.");
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const validateAndSetPreview = (data: any[]) => {
    const validatedData: CustomerData[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const customer: CustomerData = {
        name: row.name || row.Name || row.customer_name || row['Customer Name'] || '',
        email: row.email || row.Email || row.customer_email || row['Customer Email'] || '',
        phone: row.phone || row.Phone || row.customer_phone || row['Customer Phone'] || '',
        company: row.company || row.Company || row.customer_company || row['Customer Company'] || '',
        amount_due: parseFloat(row.amount_due || row['Amount Due'] || row.amount || row.Amount || 0),
        due_date: row.due_date || row['Due Date'] || row.dueDate || row.date || '',
        notes: row.notes || row.Notes || row.description || row.Description || ''
      };

      // Validate required fields
      if (!customer.name) {
        errors.push(`Row ${index + 1}: Missing customer name`);
      }
      if (!customer.email) {
        errors.push(`Row ${index + 1}: Missing email`);
      }
      if (!customer.amount_due || customer.amount_due <= 0) {
        errors.push(`Row ${index + 1}: Invalid amount due`);
      }
      if (!customer.due_date) {
        errors.push(`Row ${index + 1}: Missing due date`);
      }

      validatedData.push(customer);
    });

    if (errors.length > 0) {
      setError(`Validation errors:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`);
    } else {
      setPreview(validatedData);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleImport = async () => {
    if (!preview.length) return;

    setLoading(true);
    setError("");

    try {
      // Calculate initial status and risk level for each customer
      const customersWithStatus = preview.map(customer => {
        const status = calculateCustomerStatus(customer.due_date, 'pending');
        const riskLevel = calculateCustomerRiskLevel(customer.due_date, customer.amount_due, 'pending');
        
        return {
          user_id: user.uid,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          amount_due: customer.amount_due,
          due_date: customer.due_date,
          notes: customer.notes,
          status: status,
          risk_level: riskLevel
        };
      });

      // Insert customers into Firebase
      await batchAddCustomers(customersWithStatus);

      toast({
        title: "Import successful!",
        description: `Successfully imported ${preview.length} customers.`,
      });

      // Reset form
      setFile(null);
      setPreview([]);
      onImportComplete();
    } catch (err: any) {
      setError(err.message || "Failed to import customers");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Import Customers</span>
        </CardTitle>
        <CardDescription>
          Upload a CSV or Excel file to import customer data. The file should include columns for name, email, amount due, and due date.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
          </Alert>
        )}

        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop your file here</p>
            <p className="text-muted-foreground mb-4">
              or click to browse for CSV or Excel files
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {preview.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Preview ({preview.length} customers)</h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Valid data</span>
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 10).map((customer, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{customer.name}</td>
                          <td className="p-2">{customer.email}</td>
                          <td className="p-2">${customer.amount_due.toFixed(2)}</td>
                          <td className="p-2">{customer.due_date}</td>
                        </tr>
                      ))}
                      {preview.length > 10 && (
                        <tr>
                          <td colSpan={4} className="p-2 text-center text-muted-foreground">
                            ... and {preview.length - 10} more customers
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Button
                  onClick={handleImport}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Importing..." : `Import ${preview.length} Customers`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportCustomers; 