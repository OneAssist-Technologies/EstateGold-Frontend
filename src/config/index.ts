import { NEXT_PUBLIC_API_URL } from "./env";

export const API_URL = NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const STORAGE_KEYS = {
  COMPARE_SESSION: "estategold_compare_session",
  USER_PREFERENCES: "estategold_user_preferences",
  PROPERTY_DRAFT: "estateGold:listPropertyDraft",
  RECENT_LOCATIONS: "recent_property_locations",
};

