
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Zap, Wrench } from "lucide-react";
import { AnomalyData, fetchRealTimeAnomalies } from "@/utils/realTimeData";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/utils/mockData";

interface RealTimeMonitoringProps {
  selectedDistrict?: string;
}

const RealTimeMonitoring = ({ selectedDistrict }: RealTimeMonitoringProps) => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to get district name from ID
  const getDistrictName = (id: number) => {
    const district = districts.find(d => d.id === id);
    return district ? district.name : "Unknown";
  };

  // Map anomaly types to icons
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'meter_bypass':
        return <Zap className="h-5 w-5 text-orange-500" />;
      case 'meter_tampering':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'direct_connection':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'unauthorized_connection':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Map severity to CSS classes
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 font-medium';
      case 'medium':
        return 'text-orange-500 font-medium';
      case 'low':
        return 'text-yellow-500 font-medium';
      default:
        return 'text-gray-500';
    }
  };

  // Get anomaly type display name
  const getAnomalyTypeDisplay = (type: string) => {
    switch (type) {
      case 'meter_bypass':
        return 'Meter Bypass';
      case 'meter_tampering':
        return 'Meter Tampering';
      case 'direct_connection':
        return 'Direct Connection';
      case 'unauthorized_connection':
        return 'Unauthorized Service Connection';
      default:
        return type;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const newAnomalies = await fetchRealTimeAnomalies();
        
        // Filter anomalies if a district is selected
        const filteredAnomalies = selectedDistrict 
          ? newAnomalies.filter(anomaly => {
              const districtName = getDistrictName(anomaly.districtId);
              return districtName === selectedDistrict;
            })
          : newAnomalies;
        
        if (filteredAnomalies.length > 0) {
          setAnomalies(prev => [...filteredAnomalies, ...prev].slice(0, 5));
          
          // Show toast notification for new anomalies
          filteredAnomalies.forEach(anomaly => {
            const districtName = getDistrictName(anomaly.districtId);
            toast({
              title: `${getAnomalyTypeDisplay(anomaly.anomalyType)} - ${anomaly.severity} severity`,
              description: `New Anomaly Detected in ${districtName}`,
            });
          });
        }
      } catch (error) {
        console.error("Error fetching real-time data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchData, 15000);

    return () => clearInterval(intervalId);
  }, [toast, selectedDistrict]);

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-sm">Anomaly Feed</h3>
            {isLoading && (
              <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-ecg-red"></span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">Refreshes every 15s</span>
        </div>

        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {anomalies.length > 0 ? (
            anomalies.map((anomaly, index) => (
              <div
                key={index}
                className="relative flex items-start space-x-3 bg-muted/40 p-3 rounded-md"
              >
                <div className="flex-shrink-0">
                  {getAnomalyIcon(anomaly.anomalyType)}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {getAnomalyTypeDisplay(anomaly.anomalyType)}{" "}
                    <span className={getSeverityClass(anomaly.severity)}>
                      ({anomaly.severity})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getDistrictName(anomaly.districtId)} District
                  </p>
                  <p className="text-xs">
                    Value: {anomaly.value} (Threshold: {anomaly.threshold})
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground text-sm">
              {selectedDistrict ? 
                `No anomalies detected in ${selectedDistrict} district` : 
                "No anomalies detected"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitoring;
