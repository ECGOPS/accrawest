
import { districts, formatCurrency, getRiskLevel } from "@/utils/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RiskScoreTable = () => {
  // Sort districts by risk score in descending order
  const sortedDistricts = [...districts].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-ecg-blue text-white">
            <TableHead className="text-white">District</TableHead>
            <TableHead className="text-right text-white">Risk Score</TableHead>
            <TableHead className="text-right text-white">Fraud Amount</TableHead>
            <TableHead className="text-right text-white">% of Total</TableHead>
            <TableHead className="text-right text-white">Outstanding</TableHead>
            <TableHead className="text-right text-white">Payment Ratio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDistricts.map((district) => {
            const riskLevel = getRiskLevel(district.riskScore);
            
            return (
              <TableRow key={district.id}>
                <TableCell className="font-medium">{district.name}</TableCell>
                <TableCell className={`text-right risk-${riskLevel}`}>
                  {district.riskScore.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(district.fraudAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {district.fraudPercentage.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(district.outstandingBalance)}
                </TableCell>
                <TableCell className="text-right">
                  {(district.paymentRatio * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default RiskScoreTable;
