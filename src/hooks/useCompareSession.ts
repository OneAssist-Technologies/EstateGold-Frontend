"use client";

import { useEffect, useState } from "react";
import { CompareSession, getCompareSession } from "../services/compareService";

export const useCompareSession = () => {
  const [session, setSession] = useState<CompareSession>({ properties: [], targetType: "" });

  useEffect(() => {
    setSession(getCompareSession());
    const handleUpdate = () => {
      setSession(getCompareSession());
    };
    window.addEventListener("compare_session_changed", handleUpdate);
    return () => {
      window.removeEventListener("compare_session_changed", handleUpdate);
    };
  }, []);

  return session;
};
