
import { dashboardSummary, formatCurrency } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart, Database, Shield } from "lucide-react";

const MetricsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-ecg-red" />
            Total Fraud Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ecg-blue">
            {formatCurrency(dashboardSummary.totalFraudAmount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all districts
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Database className="h-4 w-4 mr-2 text-ecg-yellow" />
            Outstanding Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ecg-blue">
            {formatCurrency(dashboardSummary.outstandingBalance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {dashboardSummary.recoveryRate.toFixed(1)}% recovery rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-ecg-blue" />
            Average Risk Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ecg-blue">
            {dashboardSummary.averageRiskScore.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all districts
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Shield className="h-4 w-4 mr-2 text-ecg-green" />
            Total Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ecg-blue">
            {dashboardSummary.totalCases.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Detected fraud instances
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOverview;
