/* eslint-disable max-lines-per-function */
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner-native';

interface LocationObject {
  longitude: number | null;
  latitude: number | null;
}

export interface UseLocationResult {
  location: LocationObject;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>; // Function to manually trigger location fetch
}

export const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<LocationObject>({
    longitude: null,
    latitude: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchLocation = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const permissionError =
          'Permission denied. Please enable location permission in settings to use this feature.';
        if (isMountedRef.current) {
          toast.error(permissionError);
          setError(permissionError);
          setIsLoading(false);
        }
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});

      if (isMountedRef.current) {
        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        });
        setError(null); // Clear any previous error on success
      }
    } catch (e: any) {
      if (isMountedRef.current) {
        const locationServiceError =
          'Failed to get location. Please ensure location services are enabled.';
        toast.error(locationServiceError);
        setError(locationServiceError);
        console.error('Location error:', e.message || String(e));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation: fetchLocation,
  };
};
