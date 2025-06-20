// hooks/useAuthAxios.ts
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';

export function useAuthAxios() {
  const { getAccessTokenSilently } = useAuth0();

  return useMemo(() => {
    const instance = axios.create();

    instance.interceptors.request.use(async (config: any) => {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return instance;
  }, [getAccessTokenSilently]);
}
