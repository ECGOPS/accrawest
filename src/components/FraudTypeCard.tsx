
import { FraudType, formatCurrency } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface FraudTypeCardProps {
  fraudType: FraudType;
}

const FraudTypeCard = ({ fraudType }: FraudTypeCardProps) => {
  return (
    <Card className="fraud-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-ecg-blue flex justify-between items-center">
          {fraudType.name}
          <span className="text-sm font-normal bg-ecg-lightgray text-ecg-gray px-2 py-1 rounded-full">
            {fraudType.percentage.toFixed(2)}%
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Fraud Amount:</span>
            <span className="font-medium">{formatCurrency(fraudType.amount)}</span>
          </div>
          <Progress value={fraudType.percentage} className="h-1" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-ecg-lightgray p-2 rounded">
            <div className="text-muted-foreground">Consumption Ratio</div>
            <div className="font-medium">{fraudType.consumptionRatio.toFixed(4)}</div>
          </div>
          <div className="bg-ecg-lightgray p-2 rounded">
            <div className="text-muted-foreground">Payment Rate</div>
            <div className="font-medium">{fraudType.paymentRate.toFixed(2)}%</div>
          </div>
          <div className="bg-ecg-lightgray p-2 rounded">
            <div className="text-muted-foreground">Energy Charge Ratio</div>
            <div className="font-medium">{fraudType.energyChargeRatio.toFixed(4)}</div>
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
