import api from "../lib/api";

export const aiApi = {
  generateDescription: (data: Record<string, unknown>) =>
    api.post("/ai/generate-description", data),

  compareProperties: (ids: string) =>
    api.post("/ai/compare-properties", { ids }),

  getPropertyHealth: (id: string) =>
    api.get(`/ai/property-health/${id}`),

  getPropertyHighlights: (id: string) =>
    api.get(`/ai/property-highlights/${id}`),

  parseSearch: (query: string) =>
    api.post("/ai/parse-search", { query }),

  eyva: (data: Record<string, unknown>) =>
    api.post("/ai/eyva", data),

  getPropertyTips: (data: Record<string, unknown>) =>
    api.post("/ai/property-tips", data),
};
