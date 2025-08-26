'use client';

import { useAuth } from '../contexts/AuthContext';
import { useCallback, useRef } from 'react';

interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean;
}

export function useApiClient() {
  const { accessToken, refreshToken } = useAuth();
  const tokenRef = useRef(accessToken);
  
  // Update ref when token changes
  tokenRef.current = accessToken;

  const apiCall = useCallback(async <T = any>(
    url: string,
    options: ApiClientOptions = {}
  ): Promise<T> => {
    const { skipAuth = false, headers = {}, ...restOptions } = options;

    const makeRequest = async (token: string | null) => {
      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
      };

      if (!skipAuth && token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      return fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        credentials: 'include',
      });
    };

    let response = await makeRequest(tokenRef.current);

    // If unauthorized, try to refresh token
    if (response.status === 401 && !skipAuth) {
      await refreshToken();
      
      // Retry with updated token from ref
      response = await makeRequest(tokenRef.current);
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }, [refreshToken]);

  return { apiCall };
}