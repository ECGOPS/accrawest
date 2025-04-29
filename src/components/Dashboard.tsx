
import { fraudTypes } from "@/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsOverview from "./MetricsOverview";
import FraudTypeCard from "./FraudTypeCard";
import DistrictRiskCard from "./DistrictRiskCard";
import RiskScoreTable from "./RiskScoreTable";
import FraudMap from "./FraudMap";
import RealTimeMonitoring from "./RealTimeMonitoring";
import { districts } from "@/utils/mockData";

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-8">
        <img
          src="/lovable-uploads/438f5028-fcfe-44a6-bce8-869971d52767.png"
          alt="ECG Ghana Ltd Logo"
          className="h-16 w-16"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-ecg-blue">
            ECG Accra West Fraud Detection Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visualizing fraud data across eight districts to enhance detection and prevention efforts
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <MetricsOverview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dashboard-section mt-6">
        <div>
          <h2 className="dashboard-title">Fraud Type Analysis</h2>
          <div className="space-y-4">
            {fraudTypes.map((fraudType) => (
              <FraudTypeCard key={fraudType.id} fraudType={fraudType} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="dashboard-title">Real-Time Monitoring</h2>
            <RealTimeMonitoring />
          </div>

          <div>
            <h2 className="dashboard-title">Geographic Risk Assessment</h2>
            <FraudMap />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dashboard-section">
        <div>
          <h2 className="dashboard-title">High Risk Districts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Show only top 4 districts by risk score */}
            {[...districts]
              .sort((a, b) => b.riskScore - a.riskScore)
              .slice(0, 4)
              .map((district) => (
                <DistrictRiskCard key={district.id} district={district} />
              ))}
          </div>
        </div>

        <div>
          <Tabs defaultValue="risk">
            <TabsList className="mb-4">
              <TabsTrigger value="risk">Risk Score Ranking</TabsTrigger>
              <TabsTrigger value="amount">Fraud Amount Ranking</TabsTrigger>
            </TabsList>
            <TabsContent value="risk">
              <h2 className="dashboard-title">District Risk Score Table</h2>
              <RiskScoreTable />
            </TabsContent>
            <TabsContent value="amount">
              <h2 className="dashboard-title">District Fraud Amount Table</h2>
              <RiskScoreTable />
              {/* In a real application, this would be a separate table sorted by fraud amount */}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <img 
          src="/lovable-uploads/438f5028-fcfe-44a6-bce8-869971d52767.png" 
          alt="ECG Ghana Ltd Logo"
          className="h-14 w-14 opacity-70" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
