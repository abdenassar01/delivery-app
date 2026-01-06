import { useQuery } from '@tanstack/react-query';
import type * as types from './types';

const BASE_URL = 'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service';
const CLIENT_ID = 'jobboerse-jobsuche';

type JobSearchParams = {
  was?: string;
  wo?: string;
  berufsfeld?: string;
  page?: number;
  size?: number;
  arbeitgeber?: string;
  veroeffentlichtseit?: number;
  zeitarbeit?: boolean;
  angebotsart?: 1 | 2 | 4 | 34;
  befristung?: string;
  arbeitszeit?: string;
  behinderung?: boolean;
  corona?: boolean;
  umkreis?: number;
};

type UseJobSearchOptions = {
  params?: JobSearchParams;
  queryKey?: (string | number | boolean | undefined)[];
};

export const useJobSearch = (options?: UseJobSearchOptions) => {
  const { params, queryKey = [] } = options || {};

  return useQuery<types.JobSearchResponse>({
    queryKey: ['jobSearch', params, ...queryKey],
    queryFn: async () => {
      const url = new URL(`${BASE_URL}/pc/v4/jobs`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        headers: {
          'X-API-Key': CLIENT_ID,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job search results');
      }
      return response.json();
    },
  });
};

type UseJobSearchAppOptions = {
  params?: JobSearchParams;
  queryKey?: (string | number | boolean | undefined)[];
};

export const useJobSearchApp = (options?: UseJobSearchAppOptions) => {
  const { params, queryKey = [] } = options || {};

  return useQuery<types.JobSearchResponse>({
    queryKey: ['jobSearchApp', params, ...queryKey],
    queryFn: async () => {
      const url = new URL(`${BASE_URL}/pc/v4/app/jobs`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        headers: {
          'X-API-Key': CLIENT_ID,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job search (app) results');
      }
      return response.json();
    },
  });
};

type UseArbeitgeberLogoOptions = {
  hashID: string;
  queryKey?: string[];
};

export const useArbeitgeberLogo = (options: UseArbeitgeberLogoOptions) => {
  const { hashID, queryKey = [] } = options;

  return useQuery<Blob>({
    queryKey: ['arbeitgeberLogo', hashID, ...queryKey],
    queryFn: async () => {
      const url = `${BASE_URL}/ed/v1/arbeitgeberlogo/${hashID}`;

      const response = await fetch(url, {
        headers: {
          'X-API-Key': CLIENT_ID,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employer logo');
      }
      return response.blob();
    },
  });
};
