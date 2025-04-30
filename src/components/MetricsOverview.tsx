import { dashboardSummary, formatCurrency, districts } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart, Database, Shield } from "lucide-react";

interface MetricsOverviewProps {
  selectedDistrict?: string;
}

const MetricsOverview = ({ selectedDistrict }: MetricsOverviewProps) => {
  // Calculate filtered metrics based on selected district
  const filteredDistricts = selectedDistrict === "all" || !selectedDistrict
    ? districts
    : districts.filter(district => district.name === selectedDistrict);

  const totalFraudAmount = filteredDistricts.reduce((sum, district) => sum + district.fraudAmount, 0);
  const totalOutstandingBalance = filteredDistricts.reduce((sum, district) => sum + district.outstandingBalance, 0);
  const averageRiskScore = filteredDistricts.reduce((sum, district) => sum + district.riskScore, 0) / filteredDistricts.length;
  const totalCases = Math.round(filteredDistricts.reduce((sum, district) => sum + (district.fraudAmount / 42739), 0)); // Approximate cases based on average fraud amount per case
  const recoveredAmount = totalFraudAmount - totalOutstandingBalance;
  const recoveryRate = (recoveredAmount / totalFraudAmount) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-red-50 border-l-4 border-red-400 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-700 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Total Fraud Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {formatCurrency(totalFraudAmount)}
          </div>
          <p className="text-xs text-red-600 mt-1">
            {selectedDistrict === "all" || !selectedDistrict ? "Across all districts" : `In ${selectedDistrict}`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-l-4 border-yellow-400 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-700 flex items-center">
            <Database className="h-4 w-4 mr-2 text-yellow-500" />
            Outstanding Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">
            {formatCurrency(totalOutstandingBalance)}
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            {recoveryRate.toFixed(1)}% recovery rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-l-4 border-blue-400 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-blue-500" />
            Average Risk Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">
            {averageRiskScore.toFixed(2)}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {selectedDistrict === "all" || !selectedDistrict ? "Across all districts" : `In ${selectedDistrict}`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-l-4 border-green-400 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-green-500" />
            Total Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {totalCases.toLocaleString()}
          </div>
          <p className="text-xs text-green-600 mt-1">
            {selectedDistrict === "all" || !selectedDistrict ? "Across all districts" : `In ${selectedDistrict}`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOverview;
