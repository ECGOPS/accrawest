import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnomalyData, fetchRealTimeAnomalies, getCurrentAnomalies } from "@/utils/realTimeData";
import { districts } from "@/utils/mockData";
import { AlertTriangle, Activity } from "lucide-react";

const RealTimeMonitoring = () => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>(getCurrentAnomalies());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to get color based on severity
  const getSeverityColor = (severity: AnomalyData["severity"]) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-amber-500 bg-amber-50";
      case "low":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  // Function to get district name by ID
  const getDistrictName = (id: number) => {
    return districts.find((d) => d.id === id)?.name || "Unknown District";
  };

  // Function to get anomaly type display name
  const getAnomalyTypeName = (type: AnomalyData["anomalyType"]) => {
    const names = {
      consumption_spike: "Consumption Spike",
      voltage_irregularity: "Voltage Irregularity",
      connection_change: "Connection Change",
      payment_anomaly: "Payment Anomaly",
    };
    return names[type];
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      setIsLoading(true);
      try {
        const newAnomalies = await fetchRealTimeAnomalies();
        
        if (newAnomalies.length > 0) {
          // Show a toast notification for new anomalies
          const district = getDistrictName(newAnomalies[0].districtId);
          toast({
            title: `New Anomaly Detected in ${district}`,
            description: `${getAnomalyTypeName(newAnomalies[0].anomalyType)} - ${newAnomalies[0].severity} severity`,
            duration: 5000,
          });
          
          // Update anomalies (keep last 5)
          setAnomalies((prev) => [...newAnomalies, ...prev].slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching anomalies:", error);
      } finally {
        setIsLoading(false);
      }
    }, 8000); // Update every 8 seconds for demo purposes

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-ecg-blue flex items-center">
          <Activity className="h-5 w-5 mr-2 text-ecg-red" />
          Real-Time Anomaly Monitoring
          {isLoading && (
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-ecg-red"></span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {anomalies.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No anomalies detected. System monitoring active.
            </div>
          ) : (
            anomalies.map((anomaly, index) => (
              <Alert
                key={`${anomaly.districtId}-${anomaly.timestamp.toISOString()}-${index}`}
                className={`border-l-4 ${getSeverityColor(anomaly.severity)}`}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between text-sm">
                  <span>
                    {getDistrictName(anomaly.districtId)} - {getAnomalyTypeName(anomaly.anomalyType)}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {anomaly.timestamp.toLocaleTimeString()}
                  </span>
                </AlertTitle>
                <AlertDescription className="text-xs">
                  <div>
                    {anomaly.description} (Value: {anomaly.value}, Threshold: {anomaly.threshold})
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        anomaly.severity === "high"
                          ? "bg-red-100 text-red-800"
                          : anomaly.severity === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {anomaly.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </div>
        <div className="mt-3 text-xs text-center text-muted-foreground">
          Monitoring all 8 districts for anomalous activity. Updates every few seconds.
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitoring;
