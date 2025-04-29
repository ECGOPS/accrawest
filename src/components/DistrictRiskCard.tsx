
import { District, formatCurrency, getRiskLevel } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DistrictRiskCardProps {
  district: District;
}

const DistrictRiskCard = ({ district }: DistrictRiskCardProps) => {
  const riskLevel = getRiskLevel(district.riskScore);
  
  return (
    <Card className="fraud-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-ecg-blue flex justify-between items-center">
          {district.name}
          <Badge 
            variant="outline" 
            className={`risk-${riskLevel} border-risk-${riskLevel}`}
          >
            Risk: {district.riskScore.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Fraud Amount</p>
            <p className="font-medium">{formatCurrency(district.fraudAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Outstanding</p>
            <p className="font-medium">{formatCurrency(district.outstandingBalance)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-ecg-lightgray p-2 rounded">
            <div className="text-muted-foreground">Payment Ratio</div>
            <div className="font-medium">{(district.paymentRatio * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-ecg-lightgray p-2 rounded">
            <div className="text-muted-foreground">Consumption/Cost</div>
            <div className="font-medium">{district.consumptionCostRatio.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistrictRiskCard;
