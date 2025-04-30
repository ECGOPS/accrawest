import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Search, ArrowUpDown } from "lucide-react";
import { districts, fraudTypes, districtFraudTypes, formatCurrency } from "@/utils/mockData";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ReportsPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("last30days");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sortMetric, setSortMetric] = useState<{ key: 'consumptionRatio' | 'paymentRate' | 'energyChargeRatio'; direction: 'asc' | 'desc' } | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'consumptionRatio' | 'paymentRate' | 'energyChargeRatio'>('consumptionRatio');

  // Get district-specific fraud type data
  const getDistrictFraudTypes = (districtName: string) => {
    if (districtName === "all") {
      // For "all" districts, use the base fraud types data
      return fraudTypes.map(fraudType => ({
        ...fraudType,
        amount: fraudType.amount,
        percentage: fraudType.percentage,
        consumptionRatio: fraudType.consumptionRatio,
        paymentRate: fraudType.paymentRate,
        energyChargeRatio: fraudType.energyChargeRatio
      }));
    }

    const district = districts.find(d => d.name === districtName);
    if (!district) return fraudTypes;
    
    // Get all fraud types for the selected district
    const districtFraudData = districtFraudTypes.filter(
      dft => dft.districtId === district.id
    );

    // Calculate total fraud amount for the district
    const totalDistrictFraudAmount = districtFraudData.reduce(
      (sum, dft) => sum + dft.amount,
      0
    );

    // Map fraud types with recalculated percentages
    return fraudTypes.map(fraudType => {
      const districtFraudType = districtFraudData.find(
        dft => dft.fraudTypeId === fraudType.id
      );
      
      if (!districtFraudType) {
        return {
          ...fraudType,
          amount: 0,
          percentage: 0,
          consumptionRatio: 0,
          paymentRate: 0,
          energyChargeRatio: 0
        };
      }

      // Recalculate percentage based on district's total fraud amount
      const percentage = (districtFraudType.amount / totalDistrictFraudAmount) * 100;

      return {
        ...fraudType,
        amount: districtFraudType.amount,
        percentage,
        consumptionRatio: districtFraudType.consumptionRatio,
        paymentRate: districtFraudType.paymentRate,
        energyChargeRatio: districtFraudType.energyChargeRatio
      };
    });
  };

  // Update districtFraudTypesData whenever selectedDistrict changes
  const districtFraudTypesData = getDistrictFraudTypes(selectedDistrict);

  // Calculate total fraud amount and cases
  const totalFraudAmount = districtFraudTypesData.reduce((sum, type) => sum + type.amount, 0);
  const totalCases = Math.round(totalFraudAmount / 1000); // Approximate number of cases based on fraud amount

  // Mock case data with district information
  const [cases, setCases] = useState([
    { id: 1, title: "Meter Bypass Case", status: "Open", priority: "High", district: "NSAWAM", date: "2024-03-15" },
    { id: 2, title: "Tampering Investigation", status: "In Progress", priority: "Medium", district: "ACHIMOTA", date: "2024-03-14" },
    { id: 3, title: "Direct Connection", status: "Resolved", priority: "Low", district: "KANESHIE", date: "2024-03-13" },
    { id: 4, title: "Meter Tampering", status: "Open", priority: "High", district: "DANSOMAN", date: "2024-03-12" },
    { id: 5, title: "Unauthorized Connection", status: "In Progress", priority: "Medium", district: "BORTIANOR", date: "2024-03-11" },
    { id: 6, title: "Suspicious Consumption", status: "Open", priority: "High", district: "ABLEKUMA", date: "2024-03-10" },
    { id: 7, title: "Meter Bypass", status: "Resolved", priority: "Low", district: "AMASAMAN", date: "2024-03-09" },
    { id: 8, title: "Service Tampering", status: "In Progress", priority: "Medium", district: "KORLE-BU", date: "2024-03-08" },
  ]);

  // Filter and sort cases
  const filteredAndSortedCases = cases
    .filter(caseItem => {
      const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          caseItem.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = selectedDistrict === "all" || caseItem.district === selectedDistrict;
      return matchesSearch && matchesDistrict;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate fraud type distribution based on filtered data
  const fraudTypeDistribution = [
    { type: "Meter Bypass", percentage: 72.60, district: "Accra Central" },
    { type: "Meter Tampering", percentage: 26.39, district: "Kumasi" },
    { type: "Direct Connection", percentage: 0.90, district: "Takoradi" },
    { type: "Unauthorized Connection", percentage: 0.12, district: "Accra Central" },
  ].filter(item => selectedDistrict === "all" || item.district === selectedDistrict);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'Title', 'Status', 'Priority', 'District', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedCases.map(caseItem => 
        [caseItem.id, caseItem.title, caseItem.status, caseItem.priority, caseItem.district, caseItem.date].join(',')
      )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fraud-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Calculate metric statistics
  const metricStats = {
    consumptionRatio: {
      min: Math.min(...districtFraudTypesData.map(d => d.consumptionRatio)),
      max: Math.max(...districtFraudTypesData.map(d => d.consumptionRatio)),
      avg: districtFraudTypesData.reduce((sum, d) => sum + d.consumptionRatio, 0) / districtFraudTypesData.length
    },
    paymentRate: {
      min: Math.min(...districtFraudTypesData.map(d => d.paymentRate)),
      max: Math.max(...districtFraudTypesData.map(d => d.paymentRate)),
      avg: districtFraudTypesData.reduce((sum, d) => sum + d.paymentRate, 0) / districtFraudTypesData.length
    },
    energyChargeRatio: {
      min: Math.min(...districtFraudTypesData.map(d => d.energyChargeRatio)),
      max: Math.max(...districtFraudTypesData.map(d => d.energyChargeRatio)),
      avg: districtFraudTypesData.reduce((sum, d) => sum + d.energyChargeRatio, 0) / districtFraudTypesData.length
    }
  };

  // Sort fraud type metrics
  const sortedFraudTypes = [...districtFraudTypesData].sort((a, b) => {
    if (!sortMetric) return 0;
    const { key, direction } = sortMetric;
    const aValue = a[key];
    const bValue = b[key];
    if (direction === 'asc') {
      return aValue - bValue;
    }
    return bValue - aValue;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.name}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Analysis</TabsTrigger>
          <TabsTrigger value="cases">Case Reports</TabsTrigger>
          <TabsTrigger value="customers">Customer Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Fraud Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">GH₵ {totalFraudAmount.toLocaleString()}</p>
                <p className="text-sm text-red-500">+15% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalCases}</p>
                <p className="text-sm text-red-500">+8% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">51.41%</p>
                <p className="text-sm text-green-500">+2% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Resolution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3.2 days</p>
                <p className="text-sm text-green-500">-0.5 days from last period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtFraudTypesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Rate by Fraud Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtFraudTypesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="paymentRate" fill="#dc2626" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fraud">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {districtFraudTypesData.map((type, index) => (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span>{type.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{type.percentage.toFixed(2)}%</span>
                        <span className="text-sm text-muted-foreground">GH₵ {type.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Type Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Metric Selection */}
                  <div className="flex gap-4">
                    <Button
                      variant={selectedMetric === 'consumptionRatio' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedMetric('consumptionRatio');
                        setSortMetric({ key: 'consumptionRatio', direction: 'desc' });
                      }}
                      className="flex-1"
                    >
                      Consumption Ratio
                    </Button>
                    <Button
                      variant={selectedMetric === 'paymentRate' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedMetric('paymentRate');
                        setSortMetric({ key: 'paymentRate', direction: 'desc' });
                      }}
                      className="flex-1"
                    >
                      Payment Rate
                    </Button>
                    <Button
                      variant={selectedMetric === 'energyChargeRatio' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedMetric('energyChargeRatio');
                        setSortMetric({ key: 'energyChargeRatio', direction: 'desc' });
                      }}
                      className="flex-1"
                    >
                      Energy Charge Ratio
                    </Button>
                  </div>

                  {/* Metric Statistics */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Min</p>
                      <p className="font-medium">{(metricStats[selectedMetric].min * 100).toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className="font-medium">{(metricStats[selectedMetric].avg * 100).toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Max</p>
                      <p className="font-medium">{(metricStats[selectedMetric].max * 100).toFixed(2)}%</p>
                    </div>
                  </div>

                  {/* Sortable Metrics Table */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Fraud Type</h4>
                      <Button
                        variant="ghost"
                        onClick={() => setSortMetric({
                          key: selectedMetric,
                          direction: sortMetric?.direction === 'asc' ? 'desc' : 'asc'
                        })}
                        className="flex items-center gap-2"
                      >
                        {selectedMetric === 'consumptionRatio' ? 'Consumption Ratio' :
                         selectedMetric === 'paymentRate' ? 'Payment Rate' :
                         'Energy Charge Ratio'}
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {sortedFraudTypes.map((type) => (
                        <div key={type.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{type.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(type.amount)}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${type.percentage}%`,
                                backgroundColor: type.percentage > 70 ? '#ef4444' :
                                               type.percentage > 40 ? '#f59e0b' :
                                               '#10b981'
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-[10px]">
                            <div className="p-1 rounded bg-muted">
                              <div className="text-muted-foreground truncate">Consumption</div>
                              <div className="font-medium truncate">{type.consumptionRatio.toFixed(2)}</div>
                            </div>
                            <div className="p-1 rounded bg-muted">
                              <div className="text-muted-foreground truncate">Payment Rate</div>
                              <div className="font-medium truncate">{type.paymentRate.toFixed(1)}%</div>
                            </div>
                            <div className="p-1 rounded bg-muted">
                              <div className="text-muted-foreground truncate">Energy Charge</div>
                              <div className="font-medium truncate">{type.energyChargeRatio.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                        <div className="flex items-center">
                          ID
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                        <div className="flex items-center">
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                        <div className="flex items-center">
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>
                        <div className="flex items-center">
                          Priority
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('district')}>
                        <div className="flex items-center">
                          District
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedCases.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell>{caseItem.id}</TableCell>
                        <TableCell>{caseItem.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            caseItem.status === 'Open' ? 'bg-red-100 text-red-800' :
                            caseItem.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {caseItem.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            caseItem.priority === 'High' ? 'bg-red-100 text-red-800' :
                            caseItem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {caseItem.priority}
                          </span>
                        </TableCell>
                        <TableCell>{caseItem.district}</TableCell>
                        <TableCell>{caseItem.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Residential</span>
                    </div>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Commercial</span>
                    </div>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span>Industrial</span>
                    </div>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={districtFraudTypesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#2563eb" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Satisfaction</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response Time Rating</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resolution Quality</span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage; 