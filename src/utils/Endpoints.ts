const BASE = '/AppDock/api';

const Endpoints = {
  categories: {
    getAll:  `${BASE}/categories`,
    getById: (id: number) => `${BASE}/categories/${id}`,
    create:  `${BASE}/categories`,
    update:  (id: number) => `${BASE}/categories/${id}`,
    delete:  (id: number) => `${BASE}/categories/${id}`,
  },
  apps: {
    getAll:  `${BASE}/apps`,
    getById: (id: number) => `${BASE}/apps/${id}`,
    create:  `${BASE}/apps`,
    update:  (id: number) => `${BASE}/apps/${id}`,
    delete:  (id: number) => `${BASE}/apps/${id}`,
  },
  taskLogs: {
    getByApp:    (appId: number) => `${BASE}/apps/${appId}/tasks`,
    getById:     (id: number) => `${BASE}/tasks/${id}`,
    getFiltered: (updatedAfter?: string, updatedBefore?: string) => {
      const params = new URLSearchParams();
      if (updatedAfter)  params.set('updatedAfter',  updatedAfter);
      if (updatedBefore) params.set('updatedBefore', updatedBefore);
      const qs = params.toString();
      return `${BASE}/tasks${qs ? `?${qs}` : ''}`;
    },
    create:  `${BASE}/tasks`,
    update:  (id: number) => `${BASE}/tasks/${id}`,
    delete:  (id: number) => `${BASE}/tasks/${id}`,
  },
  reports: {
    summary: `${BASE}/reports/summary`,
  },
} as const;

export default Endpoints;
