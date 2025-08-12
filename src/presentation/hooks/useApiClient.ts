'use client';

import { useAuth } from '../contexts/AuthContext';
import { useCallback } from 'react';

interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean;
}

export function useApiClient() {
  const { accessToken, refreshToken } = useAuth();

  const apiCall = useCallback(async <T = any>(
    url: string,
    options: ApiClientOptions = {}
  ): Promise<T> => {
    const { skipAuth = false, headers = {}, ...restOptions } = options;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (!skipAuth && accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
      credentials: 'include',
    });

    // If unauthorized, try to refresh token
    if (response.status === 401 && !skipAuth) {
      await refreshToken();
      
      // Retry the request with new token
      if (accessToken) {
        requestHeaders['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(url, {
          ...restOptions,
          headers: requestHeaders,
          credentials: 'include',
        });
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }, [accessToken, refreshToken]);

  return { apiCall };
}