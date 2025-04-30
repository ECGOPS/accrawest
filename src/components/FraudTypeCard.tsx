import { FraudType, formatCurrency, DistrictFraudType } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";

interface FraudTypeCardProps {
  fraudType: FraudType;
  districtFraudType?: DistrictFraudType;
  isFiltered?: boolean;
}

const FraudTypeCard = ({ fraudType, districtFraudType, isFiltered }: FraudTypeCardProps) => {
  const displayData = districtFraudType || {
    amount: fraudType.amount,
    percentage: fraudType.percentage,
    consumptionRatio: fraudType.consumptionRatio,
    paymentRate: fraudType.paymentRate,
    energyChargeRatio: fraudType.energyChargeRatio,
  };

  return (
    <Card className={`fraud-card ${isFiltered ? 'border-ecg-blue' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-ecg-blue flex justify-between items-center">
          <div className="flex items-center gap-2">
            {fraudType.name}
            {isFiltered && (
              <Info className="h-4 w-4 text-ecg-blue" />
            )}
          </div>
          <span className={`text-sm font-normal px-2 py-1 rounded-full ${
            isFiltered ? 'bg-ecg-blue text-white' : 'bg-ecg-lightgray text-ecg-gray'
          }`}>
            {displayData.percentage.toFixed(2)}%
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Fraud Amount:</span>
            <span className="font-medium">{formatCurrency(displayData.amount)}</span>
          </div>
          <Progress 
            value={displayData.percentage} 
            className={`h-1 ${isFiltered ? 'bg-ecg-lightblue' : ''}`}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className={`p-2 rounded ${isFiltered ? 'bg-ecg-lightblue' : 'bg-ecg-lightgray'}`}>
            <div className="text-muted-foreground">Consumption Ratio</div>
            <div className="font-medium">{displayData.consumptionRatio.toFixed(4)}</div>
          </div>
          <div className={`p-2 rounded ${isFiltered ? 'bg-ecg-lightblue' : 'bg-ecg-lightgray'}`}>
            <div className="text-muted-foreground">Payment Rate</div>
            <div className="font-medium">{displayData.paymentRate.toFixed(2)}%</div>
          </div>
          <div className={`p-2 rounded ${isFiltered ? 'bg-ecg-lightblue' : 'bg-ecg-lightgray'}`}>
            <div className="text-muted-foreground">Energy Charge Ratio</div>
            <div className="font-medium">{displayData.energyChargeRatio.toFixed(4)}</div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detection-signals">
            <AccordionTrigger className="text-sm font-medium">Detection Signals</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 text-sm">
                {fraudType.detectionSignals.map((signal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-xs">•</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FraudTypeCard;
