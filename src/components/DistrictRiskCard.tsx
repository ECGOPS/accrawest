import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { District, getRiskLevel } from "@/utils/mockData";
import { cn } from "@/lib/utils";

interface DistrictRiskCardProps {
  district: District;
}

const DistrictRiskCard = ({ district }: DistrictRiskCardProps) => {
  const riskLevel = getRiskLevel(district.riskScore);
  
  const riskColors = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-500'
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-500'
    },
    low: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: 'text-green-500'
    }
  };

  const colors = riskColors[riskLevel];
  
  return (
    <Card className={cn("h-full border-2", colors.border)}>
      <CardContent className={cn("p-4 h-full flex flex-col", colors.bg)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn("font-medium text-sm sm:text-base truncate", colors.text)}>
            {district.name}
          </h3>
          <AlertTriangle className={cn("h-4 w-4", colors.icon)} />
        </div>
        
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Risk Score</span>
            <span className={cn("font-medium", colors.text)}>
              {district.riskScore.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Fraud Amount</span>
            <span className={cn("font-medium", colors.text)}>
              GH₵ {district.fraudAmount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Outstanding</span>
            <span className={cn("font-medium", colors.text)}>
              GH₵ {district.outstandingBalance.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Payment Ratio</span>
            <span className={cn("font-medium", colors.text)}>
              {(district.paymentRatio * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistrictRiskCard;
