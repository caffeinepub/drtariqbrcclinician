import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
      setShowOnlineAlert(true);
      
      // Hide online alert after 3 seconds
      setTimeout(() => {
        setShowOnlineAlert(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
      setShowOnlineAlert(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      setShowOfflineAlert(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineAlert && !showOnlineAlert) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-in slide-in-from-left-5">
      {showOfflineAlert && (
        <Alert variant="destructive" className="border-orange-500 bg-orange-50 dark:border-orange-700 dark:bg-orange-950">
          <WifiOff className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-900 dark:text-orange-200">
            You are currently offline. Some features may be limited. Cached content is still available.
          </AlertDescription>
        </Alert>
      )}
      {showOnlineAlert && (
        <Alert className="border-emerald-500 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950">
          <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <AlertDescription className="text-emerald-900 dark:text-emerald-200">
            You are back online!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
