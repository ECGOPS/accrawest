import { useState } from "react";
import { fraudTypes, districts, districtFraudTypes } from "@/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MetricsOverview from "./MetricsOverview";
import FraudTypeCard from "./FraudTypeCard";
import DistrictRiskCard from "./DistrictRiskCard";
import RiskScoreTable from "./RiskScoreTable";
import FraudMap from "./FraudMap";
import RealTimeMonitoring from "./RealTimeMonitoring";
import { AnomalyData } from '@/utils/realTimeData';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const { toast } = useToast();

  // Filter districts based on selection
  const filteredDistricts = selectedDistrict === "all" 
    ? districts 
    : districts.filter(district => district.name === selectedDistrict);

  // Get top 4 districts by risk score from filtered districts
  const topRiskDistricts = [...filteredDistricts]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  // Get district-specific fraud type data
  const getDistrictFraudTypes = (districtName: string) => {
    if (districtName === "all") return undefined;
    const district = districts.find(d => d.name === districtName);
    if (!district) return undefined;
    
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
      
      if (!districtFraudType) return undefined;

      // Recalculate percentage based on district's total fraud amount
      const percentage = (districtFraudType.amount / totalDistrictFraudAmount) * 100;

      return {
        ...districtFraudType,
        percentage
      };
    });
  };

  const clearFilter = () => {
    setSelectedDistrict("all");
  };

  const districtFraudTypesData = getDistrictFraudTypes(selectedDistrict);

  const handleNewCase = (anomaly: AnomalyData) => {
    const districtName = districts.find(d => d.id === anomaly.districtId)?.name || 'Unknown';
    const caseTitle = `${getAnomalyTypeDisplay(anomaly.anomalyType)} in ${districtName}`;
    const caseDescription = `High severity anomaly detected: ${anomaly.description}\nValue: ${anomaly.value} (Threshold: ${anomaly.threshold})`;

    // Get existing cases from localStorage
    const existingCases = JSON.parse(localStorage.getItem('cases') || '[]');
    
    // Create new case
    const newCase = {
      id: Date.now().toString(),
      title: caseTitle,
      description: caseDescription,
      status: 'Open' as const,
      priority: 'High' as const,
      assignedTo: 'Unassigned',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      district: districtName,
      anomalyType: anomaly.anomalyType,
      value: anomaly.value,
      threshold: anomaly.threshold,
    };

    // Save updated cases to localStorage
    localStorage.setItem('cases', JSON.stringify([...existingCases, newCase]));

    // Show toast notification
    toast({
      title: "New Case Created",
      description: `A case has been automatically created for the high severity anomaly in ${districtName}`,
      variant: "default",
    });
  };

  const getAnomalyTypeDisplay = (type: string) => {
    switch (type) {
      case 'meter_bypass':
        return 'Meter Bypass';
      case 'meter_tampering':
        return 'Meter Tampering';
      case 'direct_connection':
        return 'Direct Connection';
      case 'unauthorized_connection':
        return 'Unauthorized Service Connection';
      default:
        return type;
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-2 sm:p-4">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="/assets/new-logo.svg"
          alt="Accra West Logo"
          className="w-12 h-12"
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-ecg-blue">
            ECG Accra West Fraud Detection Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualizing fraud data across eight districts to enhance detection and prevention efforts
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Dashboard Overview</h2>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Filter className={`h-4 w-4 ${selectedDistrict !== "all" ? "text-ecg-blue" : "text-muted-foreground"}`} />
                  <Select
                    value={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                  >
                    <SelectTrigger className={`w-[180px] ${selectedDistrict !== "all" ? "border-ecg-blue" : ""}`}>
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
                  {selectedDistrict !== "all" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearFilter}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter dashboard data by district</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="dashboard-section">
        <MetricsOverview selectedDistrict={selectedDistrict === "all" ? undefined : selectedDistrict} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 dashboard-section mt-1">
        <div>
          <h2 className="dashboard-title mb-1">Fraud Type Analysis</h2>
          <div className="space-y-1">
            {fraudTypes.map((fraudType, index) => (
              <FraudTypeCard 
                key={fraudType.id} 
                fraudType={fraudType} 
                districtFraudType={districtFraudTypesData?.[index]}
                isFiltered={selectedDistrict !== "all"}
              />
            ))}
          </div>
          
          <div className="mt-1">
            <h2 className="dashboard-title mb-1">High Risk Districts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {topRiskDistricts.map((district) => (
                <DistrictRiskCard key={district.id} district={district} />
              ))}
            </div>
            {selectedDistrict !== "all" && topRiskDistricts.length === 0 && (
              <div className="text-center p-1 text-muted-foreground">
                No district data available for the selected filter
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            <h2 className="dashboard-title mb-1">Real-Time Monitoring</h2>
            <RealTimeMonitoring 
              selectedDistrict={selectedDistrict === "all" ? undefined : selectedDistrict}
              onNewCase={handleNewCase}
            />
          </div>

          <div>
            <h2 className="dashboard-title mb-1">Geographic Risk Assessment</h2>
            <FraudMap />
          </div>

          <div>
            <Tabs defaultValue="risk" className="w-full">
              <TabsList className="mb-1 bg-slate-100 p-0.5">
                <TabsTrigger 
                  value="risk" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Risk Score Ranking
                </TabsTrigger>
                <TabsTrigger 
                  value="amount"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  Fraud Amount Ranking
                </TabsTrigger>
              </TabsList>
              <TabsContent value="risk">
                <h2 className="dashboard-title mb-1">District Risk Score Table</h2>
                <RiskScoreTable districts={filteredDistricts} type="risk" />
              </TabsContent>
              <TabsContent value="amount">
                <h2 className="dashboard-title mb-1">District Fraud Amount Table</h2>
                <RiskScoreTable districts={filteredDistricts} type="amount" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
