import { toast } from "@/components/ui/use-toast";

interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showNotification = (options: NotificationOptions) => {
  // Get notification settings from localStorage
  const appSettings = localStorage.getItem('appSettings');
  const settings = appSettings ? JSON.parse(appSettings) : null;
  
  // Check if notifications are enabled
  const notificationsEnabled = settings?.notifications?.enabled ?? true;
  
  // Only show toast if notifications are enabled
  if (notificationsEnabled) {
    toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 2000,
    });
  }
};

// Function to check if notifications are enabled
export const areNotificationsEnabled = (): boolean => {
  const appSettings = localStorage.getItem('appSettings');
  if (!appSettings) return true; // Default to enabled if no settings exist
  
  const settings = JSON.parse(appSettings);
  return settings?.notifications?.enabled ?? true;
}; 