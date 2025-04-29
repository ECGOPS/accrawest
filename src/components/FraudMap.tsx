
import { districts, getRiskLevel } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FraudMap = () => {
  // For now, we'll create a simple representation of the districts
  // In a real application, this would be replaced with an actual map
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-ecg-blue">
          Geographic Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {districts.map((district) => {
              const riskLevel = getRiskLevel(district.riskScore);
              
              return (
                <div 
                  key={district.id}
                  className={`border-2 border-risk-${riskLevel} rounded p-3 text-center`}
                >
                  <div className="font-medium">{district.name}</div>
                  <div className={`text-sm risk-${riskLevel}`}>
                    Risk Score: {district.riskScore.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {district.fraudPercentage.toFixed(2)}% of total fraud
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            This simplified visualization shows risk levels across districts. 
            <br />In a complete solution, this would be an interactive GIS map.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudMap;
