import { Property } from "../types/property";
import { STORAGE_KEYS } from "../config/index";

export interface CompareSession {
  properties: Property[];
  targetType: string;
  targetCommercialSubtype?: string;
}

const STORAGE_KEY = STORAGE_KEYS.COMPARE_SESSION;

export const getCompareSession = (): CompareSession => {
  if (typeof window === "undefined") {
    return { properties: [], targetType: "" };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { properties: [], targetType: "" };
  try {
    return JSON.parse(raw);
  } catch (err) {
    return { properties: [], targetType: "" };
  }
};

export const saveCompareSession = (session: CompareSession) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("compare_session_changed"));
};

export const clearCompareSession = () => {
  saveCompareSession({ properties: [], targetType: "" });
};

export const addPropertyToCompare = (property: Property): { success: boolean; message?: string } => {
  const session = getCompareSession();
  const list = session.properties;

  if (list.some((p) => p._id === property._id)) {
    return { success: true }; // Already added
  }

  if (list.length >= 3) {
    return { success: false, message: "Maximum 3 properties can be compared." };
  }

  // Determine comparison target type on first element
  if (list.length === 0) {
    const isCommercial = (property.propertyType || "").toLowerCase().includes("commercial");
    session.targetType = property.propertyType;
    if (isCommercial) {
      session.targetCommercialSubtype = (property as any).commercialType;
    }
  } else {
    // Validate same type rule
    if (property.propertyType !== session.targetType) {
      return { success: false, message: "You can compare properties of the same type only." };
    }
    // Validate commercial subtype rule
    const isCommercial = (property.propertyType || "").toLowerCase().includes("commercial");
    if (isCommercial) {
      if ((property as any).commercialType !== session.targetCommercialSubtype) {
        return { success: false, message: "You can compare commercial properties of the same type only." };
      }
    }
  }

  session.properties.push(property);
  saveCompareSession(session);
  return { success: true };
};

export const removePropertyFromCompare = (propertyId: string) => {
  const session = getCompareSession();
  session.properties = session.properties.filter((p) => p._id !== propertyId);

  // Recalculate target type based on the first remaining property
  if (session.properties.length > 0) {
    const first = session.properties[0];
    const isCommercial = (first.propertyType || "").toLowerCase().includes("commercial");
    session.targetType = first.propertyType;
    if (isCommercial) {
      session.targetCommercialSubtype = (first as any).commercialType;
    } else {
      delete session.targetCommercialSubtype;
    }
  } else {
    session.targetType = "";
    delete session.targetCommercialSubtype;
  }

  saveCompareSession(session);
};

