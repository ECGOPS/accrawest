import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Upload, FileText, Image, Download, Trash2, Search, Filter, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface DocumentItem {
  id: string;
  name: string;
  type: 'PDF' | 'Image' | 'Other';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  caseId: string;
  description: string;
  category: 'Evidence' | 'Report' | 'Invoice' | 'Other';
  status: 'Active' | 'Archived';
}

const DocumentManagement: React.FC = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: '1',
      name: 'Meter Reading Report.pdf',
      type: 'PDF',
      size: '2.5 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-03-15',
      caseId: '1',
      description: 'Initial meter reading analysis report',
      category: 'Report',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Suspicious Activity Screenshot.png',
      type: 'Image',
      size: '1.2 MB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-03-16',
      caseId: '1',
      description: 'Screenshot of unusual meter reading pattern',
      category: 'Evidence',
      status: 'Active',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    description: '',
    category: 'Other' as DocumentItem['category'],
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const documentToAdd: DocumentItem = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'Other',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: 'Current User', // This would come from auth context
        uploadedAt: new Date().toISOString().split('T')[0],
        caseId: '1', // This would come from the current case context
        description: newDocument.description,
        category: newDocument.category,
        status: 'Active',
      };
      setDocuments([...documents, documentToAdd]);
      setNewDocument({ name: '', description: '', category: 'Other' });
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      });
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been successfully deleted.",
    });
  };

  const handleDownloadDocument = async (doc: DocumentItem) => {
    try {
      // In a real application, you would fetch the file from your API
      const response = await fetch(`/api/documents/${doc.id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = globalThis.document.createElement('a');
      link.href = url;
      link.download = doc.name;
      
      // Append to body, click, and remove
      globalThis.document.body.appendChild(link);
      link.click();
      
      // Clean up
      globalThis.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${doc.name}...`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-6 h-6" />;
      case 'Image':
        return <Image className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: DocumentItem['category']) => {
    switch (category) {
      case 'Evidence':
        return 'bg-blue-100 text-blue-800';
      case 'Report':
        return 'bg-green-100 text-green-800';
      case 'Invoice':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Document Management</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Evidence">Evidence</SelectItem>
            <SelectItem value="Report">Report</SelectItem>
            <SelectItem value="Invoice">Invoice</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getFileIcon(document.type)}
                  <div>
                    <h3 className="font-medium">{document.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {document.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Uploaded by: {document.uploadedBy}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Size: {document.size}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Date: {document.uploadedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedDocument(document);
                      setIsPreviewOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownloadDocument(document)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {getFileIcon(selectedDocument.type)}
                <div>
                  <h3 className="font-medium">{selectedDocument.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.description}
                  </p>
                </div>
              </div>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {selectedDocument.type === 'PDF' ? 'PDF Preview' : 'Image Preview'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement; 