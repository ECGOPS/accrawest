
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency, District, getRiskLevel } from "@/utils/mockData";

interface RiskScoreTableProps {
  districts?: District[];
}

const RiskScoreTable = ({ districts = [] }: RiskScoreTableProps) => {
  // Sort districts by risk score (highest first)
  const sortedDistricts = [...districts].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>District</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead className="hidden md:table-cell">Fraud Amount</TableHead>
            <TableHead className="hidden md:table-cell">% of Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDistricts.length > 0 ? (
            sortedDistricts.map((district) => {
              const riskLevel = getRiskLevel(district.riskScore);
              
              return (
                <TableRow key={district.id}>
                  <TableCell className="font-medium">{district.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full bg-risk-${riskLevel} mr-2`}></span>
                      <span>{district.riskScore.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatCurrency(district.fraudAmount)}</TableCell>
                  <TableCell className="hidden md:table-cell">{district.fraudPercentage.toFixed(2)}%</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
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
