import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CustomerData {
  id: string;
  name: string;
  accountNumber: string;
  meterNumber: string;
  district: string;
  consumption: number;
  paymentHistory: number[];
  riskScore: number;
  lastReading: string;
  status: 'Normal' | 'Suspicious' | 'High Risk';
}

const CustomerAnalysis: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - in a real application, this would come from an API
  const customers: CustomerData[] = [
    {
      id: '1',
      name: 'John Doe',
      accountNumber: 'ACC001',
      meterNumber: 'P19100001',
      district: 'NSAWAM',
      consumption: 250,
      paymentHistory: [100, 95, 90, 85, 80],
      riskScore: 75,
      lastReading: '2024-03-15',
      status: 'Suspicious',
    },
    {
      id: '2',
      name: 'Jane Smith',
      accountNumber: 'ACC002',
      meterNumber: 'P19100002',
      district: 'ACHIMOTA',
      consumption: 180,
      paymentHistory: [100, 100, 100, 100, 100],
      riskScore: 20,
      lastReading: '2024-03-16',
      status: 'Normal',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      accountNumber: 'ACC003',
      meterNumber: 'P19100003',
      district: 'KANESHIE',
      consumption: 500,
      paymentHistory: [60, 55, 50, 45, 40],
      riskScore: 90,
      lastReading: '2024-03-14',
      status: 'High Risk',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      accountNumber: 'ACC004',
      meterNumber: 'P19100004',
      district: 'DANSOMAN',
      consumption: 320,
      paymentHistory: [95, 90, 85, 80, 75],
      riskScore: 65,
      lastReading: '2024-03-17',
      status: 'Suspicious',
    },
    {
      id: '5',
      name: 'Michael Brown',
      accountNumber: 'ACC005',
      meterNumber: 'P19100005',
      district: 'BORTIANOR',
      consumption: 150,
      paymentHistory: [100, 100, 100, 100, 100],
      riskScore: 15,
      lastReading: '2024-03-18',
      status: 'Normal',
    },
    {
      id: '6',
      name: 'Emily Davis',
      accountNumber: 'ACC006',
      meterNumber: 'P19100006',
      district: 'ABLEKUMA',
      consumption: 280,
      paymentHistory: [85, 80, 75, 70, 65],
      riskScore: 70,
      lastReading: '2024-03-19',
      status: 'Suspicious',
    },
    {
      id: '7',
      name: 'David Wilson',
      accountNumber: 'ACC007',
      meterNumber: 'P19100007',
      district: 'AMASAMAN',
      consumption: 420,
      paymentHistory: [50, 45, 40, 35, 30],
      riskScore: 85,
      lastReading: '2024-03-20',
      status: 'High Risk',
    },
    {
      id: '8',
      name: 'Lisa Anderson',
      accountNumber: 'ACC008',
      meterNumber: 'P19100008',
      district: 'KORLE-BU',
      consumption: 190,
      paymentHistory: [100, 100, 100, 100, 100],
      riskScore: 25,
      lastReading: '2024-03-21',
      status: 'Normal',
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || customer.district === districtFilter;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const getStatusColor = (status: CustomerData['status']) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800';
      case 'Suspicious':
        return 'bg-yellow-100 text-yellow-800';
      case 'High Risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'High Risk';
    if (score >= 50) return 'Suspicious';
    return 'Normal';
  };

  // Mock data for consumption trends
  const consumptionTrends = [
    { month: 'Jan', consumption: 1200, average: 1000 },
    { month: 'Feb', consumption: 1500, average: 1000 },
    { month: 'Mar', consumption: 1800, average: 1000 },
    { month: 'Apr', consumption: 2000, average: 1000 },
    { month: 'May', consumption: 2200, average: 1000 },
    { month: 'Jun', consumption: 2500, average: 1000 },
  ];

  // Mock data for risk analysis
  const riskAnalysis = [
    { name: 'High Risk', value: customers.filter(c => c.status === 'High Risk').length },
    { name: 'Suspicious', value: customers.filter(c => c.status === 'Suspicious').length },
    { name: 'Normal', value: customers.filter(c => c.status === 'Normal').length },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Analysis</h1>
        <div className="flex items-center space-x-4">
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-l-4 border-blue-400 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{customers.length}</div>
            <p className="text-xs text-blue-600 mt-1">
              Active customers in the system
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-l-4 border-red-400 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              High Risk Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {customers.filter(c => c.status === 'High Risk').length}
            </div>
            <p className="text-xs text-red-600 mt-1">
              Customers requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-l-4 border-yellow-400 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-yellow-500" />
              Average Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {Math.round(customers.reduce((acc, curr) => acc + curr.riskScore, 0) / customers.length)}
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Overall risk assessment
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Select value={districtFilter} onValueChange={setDistrictFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            <SelectItem value="NSAWAM">NSAWAM</SelectItem>
            <SelectItem value="ACHIMOTA">ACHIMOTA</SelectItem>
            <SelectItem value="KANESHIE">KANESHIE</SelectItem>
            <SelectItem value="DANSOMAN">DANSOMAN</SelectItem>
            <SelectItem value="BORTIANOR">BORTIANOR</SelectItem>
            <SelectItem value="ABLEKUMA">ABLEKUMA</SelectItem>
            <SelectItem value="AMASAMAN">AMASAMAN</SelectItem>
            <SelectItem value="KORLE-BU">KORLE-BU</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Suspicious">Suspicious</SelectItem>
            <SelectItem value="High Risk">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Customer List</TabsTrigger>
          <TabsTrigger value="trends">Consumption Trends</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {filteredCustomers.map((customer) => {
              // Get status-based styles
              const statusStyles = {
                'High Risk': {
                  container: 'bg-red-50 border-red-200',
                  text: 'text-red-700',
                  badge: 'bg-red-100 text-red-700'
                },
                'Suspicious': {
                  container: 'bg-yellow-50 border-yellow-200',
                  text: 'text-yellow-700',
                  badge: 'bg-yellow-100 text-yellow-700'
                },
                'Normal': {
                  container: 'bg-green-50 border-green-200',
                  text: 'text-green-700',
                  badge: 'bg-green-100 text-green-700'
                }
              };

              const styles = statusStyles[customer.status];
              
              return (
                <Card key={customer.id} className={`border-2 ${styles.container}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className={`font-medium ${styles.text}`}>{customer.name}</h3>
                        <p className={`text-sm ${styles.text}`}>
                          Account: {customer.accountNumber} | Meter: {customer.meterNumber}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-sm ${styles.text}`}>
                            District: {customer.district}
                          </span>
                          <span className={`text-sm ${styles.text}`}>
                            Consumption: {customer.consumption} kWh
                          </span>
                          <span className={`text-sm ${styles.text}`}>
                            Last Reading: {customer.lastReading}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">Risk Score</div>
                          <div className={`text-2xl font-bold ${styles.text}`}>
                            {customer.riskScore}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${styles.badge}`}>
                          {customer.status}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={consumptionTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#2563eb"
                      name="Actual Consumption"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#94a3b8"
                      name="Average Consumption"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={customers}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="riskScore"
                        fill="#2563eb"
                        name="Risk Score"
                      >
                        {customers.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.status === 'High Risk' ? '#ef4444' : entry.status === 'Suspicious' ? '#f59e0b' : '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerAnalysis; 