
import { fraudTypes } from "@/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsOverview from "./MetricsOverview";
import FraudTypeCard from "./FraudTypeCard";
import DistrictRiskCard from "./DistrictRiskCard";
import RiskScoreTable from "./RiskScoreTable";
import FraudMap from "./FraudMap";
import { districts } from "@/utils/mockData";

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-ecg-blue">
          ECG Accra West Fraud Detection Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visualizing fraud data across eight districts to enhance detection and prevention efforts
        </p>
      </div>

      <div className="dashboard-section">
        <MetricsOverview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dashboard-section">
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
            <h2 className="dashboard-title">Geographic Risk Assessment</h2>
            <FraudMap />
          </div>

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
        </div>
      </div>

      <div className="dashboard-section">
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

      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          This dashboard provides insights based on analysis of fraud data across ECG Accra West's eight districts. 
          For detailed implementation of the big data analytics architecture and district-specific strategies, 
          please refer to the complete fraud detection model documentation.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
