import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency, District, getRiskLevel } from "@/utils/mockData";
import { cn } from "@/lib/utils";

interface RiskScoreTableProps {
  districts?: District[];
  type?: 'risk' | 'amount';
}

const RiskScoreTable = ({ districts = [], type = 'risk' }: RiskScoreTableProps) => {
  // Sort districts by risk score or fraud amount (highest first)
  const sortedDistricts = [...districts].sort((a, b) => 
    type === 'risk' 
      ? b.riskScore - a.riskScore 
      : b.fraudAmount - a.fraudAmount
  );

  const getRiskColor = (score: number) => {
    const level = getRiskLevel(score);
    return {
      high: 'bg-red-500 text-red-50',
      medium: 'bg-yellow-500 text-yellow-50',
      low: 'bg-green-500 text-green-50'
    }[level];
  };

  const getAmountColor = (amount: number, max: number) => {
    const percentage = amount / max;
    if (percentage >= 0.7) return 'bg-red-500 text-red-50';
    if (percentage >= 0.4) return 'bg-yellow-500 text-yellow-50';
    return 'bg-blue-500 text-blue-50';
  };

  const maxAmount = Math.max(...districts.map(d => d.fraudAmount));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100">
            <TableHead className="font-semibold">District</TableHead>
            <TableHead className="font-semibold">
              {type === 'risk' ? 'Risk Score' : 'Fraud Amount'}
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              {type === 'risk' ? 'Fraud Amount' : 'Risk Score'}
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">% of Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDistricts.length > 0 ? (
            sortedDistricts.map((district) => {
              const riskLevel = getRiskLevel(district.riskScore);
              const riskColor = getRiskColor(district.riskScore);
              const amountColor = getAmountColor(district.fraudAmount, maxAmount);
              
              return (
                <TableRow 
                  key={district.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-medium">{district.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        type === 'risk' ? riskColor : amountColor
                      )}>
                        {type === 'risk' 
                          ? district.riskScore.toFixed(2)
                          : formatCurrency(district.fraudAmount)
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      type === 'risk' ? amountColor : riskColor
                    )}>
                      {type === 'risk'
                        ? formatCurrency(district.fraudAmount)
                        : district.riskScore.toFixed(2)
                      }
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100">
                      {district.fraudPercentage.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                No district data available for the selected filter
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RiskScoreTable;
