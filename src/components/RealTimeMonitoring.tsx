
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AnomalyData, 
  fetchRealTimeAnomalies, 
  getCurrentAnomalies 
} from "@/utils/realTimeData";
import { districts } from "@/utils/mockData";
import { 
  AlertTriangle, 
  Activity, 
  Zap, 
  Wrench, 
  Cable, 
  Network, 
  ChevronRight 
} from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const RealTimeMonitoring = () => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>(getCurrentAnomalies());
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to get color based on severity
  const getSeverityColor = (severity: AnomalyData["severity"]) => {
    switch (severity) {
      case "high":
        return "border-risk-high bg-red-50 dark:bg-red-950/10";
      case "medium":
        return "border-risk-medium bg-amber-50 dark:bg-amber-950/10";
      case "low":
        return "border-risk-low bg-green-50 dark:bg-green-950/10";
      default:
        return "border-gray-200 bg-white dark:bg-gray-800";
    }
  };

  // Function to get district name by ID
  const getDistrictName = (id: number) => {
    return districts.find((d) => d.id === id)?.name || "Unknown District";
  };

  // Function to get anomaly type icon
  const getAnomalyIcon = (type: AnomalyData["anomalyType"]) => {
    switch (type) {
      case "meter_bypass":
        return <Zap className="h-4 w-4 text-red-600" />;
      case "meter_tampering":
        return <Wrench className="h-4 w-4 text-amber-600" />;
      case "direct_connection":
        return <Cable className="h-4 w-4 text-blue-600" />;
      case "unauthorized_connection":
        return <Network className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Function to get anomaly type display name
  const getAnomalyTypeName = (type: AnomalyData["anomalyType"]) => {
    const names = {
      meter_bypass: "Meter Bypass",
      meter_tampering: "Meter Tampering",
      direct_connection: "Direct Connection",
      unauthorized_connection: "Unauthorized Service Connection",
    };
    return names[type];
  };

  // Toggle expanded state of anomaly
  const toggleExpand = useCallback((id: string) => {
    setExpandedAnomaly(prev => prev === id ? null : id);
  }, []);

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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-ecg-blue flex items-center">
          <Activity className="h-5 w-5 mr-2 text-ecg-red" />
          Real-Time Anomaly Monitoring
          {isLoading && (
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-ecg-red"></span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {anomalies.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No anomalies detected. System monitoring active.
            </div>
          ) : (
            anomalies.map((anomaly, index) => {
              const anomalyId = `${anomaly.districtId}-${anomaly.timestamp.toISOString()}-${index}`;
              const isExpanded = expandedAnomaly === anomalyId;
              
              return (
                <Alert
                  key={anomalyId}
                  className={`border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${getSeverityColor(anomaly.severity)}`}
                  onClick={() => toggleExpand(anomalyId)}
                >
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      {getAnomalyIcon(anomaly.anomalyType)}
                    </div>
                    <div className="flex-1">
                      <AlertTitle className="flex items-center justify-between text-sm">
                        <HoverCard>
                          <HoverCardTrigger>
                            <span className="font-medium hover:underline">
                              {getDistrictName(anomaly.districtId)} - {getAnomalyTypeName(anomaly.anomalyType)}
                            </span>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80 p-2">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Detection Signals:</h4>
                              {anomaly.anomalyType === 'meter_bypass' && (
                                <ul className="text-xs list-disc pl-4 space-y-1">
                                  <li>Sudden drops in power consumption</li>
                                  <li>Consistent consumption regardless of season</li>
                                  <li>Higher than average meter failures</li>
                                  <li>Mismatch between expected and actual consumption</li>
                                </ul>
                              )}
                              {anomaly.anomalyType === 'meter_tampering' && (
                                <ul className="text-xs list-disc pl-4 space-y-1">
                                  <li>Unusual variability in consumption readings</li>
                                  <li>Broken meter seals or physical damage</li>
                                  <li>History of meter replacements</li>
                                  <li>Significant decrease without change in usage patterns</li>
                                </ul>
                              )}
                              {anomaly.anomalyType === 'direct_connection' && (
                                <ul className="text-xs list-disc pl-4 space-y-1">
                                  <li>Zero or minimal recorded consumption</li>
                                  <li>Visual evidence of wiring irregularities</li>
                                  <li>Distribution line losses in specific clusters</li>
                                  <li>Service calls unrelated to registered connections</li>
                                </ul>
                              )}
                              {anomaly.anomalyType === 'unauthorized_connection' && (
                                <ul className="text-xs list-disc pl-4 space-y-1">
                                  <li>Connection without proper documentation</li>
                                  <li>Absence from billing system</li>
                                  <li>Irregular payment history</li>
                                  <li>Inconsistent customer details</li>
                                </ul>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                        <div className="flex items-center">
                          <span className="text-xs font-normal text-muted-foreground">
                            {anomaly.timestamp.toLocaleTimeString()}
                          </span>
                          <ChevronRight
                            className={`h-4 w-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </div>
                      </AlertTitle>
                      <AlertDescription className="text-xs">
                        <div>
                          {anomaly.description}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                              anomaly.severity === "high"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : anomaly.severity === "medium"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {anomaly.severity.toUpperCase()} SEVERITY
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Value: {anomaly.value}, Threshold: {anomaly.threshold}
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-3 pt-2 border-t text-xs animate-fade-in">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="font-medium">Risk Analysis:</p>
                                <p>Financial Impact: {anomaly.severity === 'high' ? 'Significant' : anomaly.severity === 'medium' ? 'Moderate' : 'Low'}</p>
                                <p>Pattern Confidence: {anomaly.value > anomaly.threshold + 20 ? 'High' : anomaly.value > anomaly.threshold + 10 ? 'Medium' : 'Low'}</p>
                              </div>
                              <div>
                                <p className="font-medium">Recommended Action:</p>
                                <p>{anomaly.severity === 'high' ? 'Immediate investigation required' : 
                                   anomaly.severity === 'medium' ? 'Schedule inspection within 48 hours' : 
                                   'Include in next routine inspection'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              );
            })
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
