import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Cross-section highlight bus. Any section can call setHighlight({ source, ... ids })
 * and other sections subscribe to glow / scale matching items.
 *
 * Shape: {
 *   source: "experience" | "project" | "skill",
 *   id: string,
 *   experiences: string[],
 *   projects:    string[],
 *   skills:      string[]
 * }
 *
 * Auto-clears after AUTO_CLEAR_MS.
 */
const AUTO_CLEAR_MS = 6000;

const HighlightContext = createContext({
  highlight: null,
  setHighlight: () => {},
  clear: () => {},
  isHighlighted: () => false
});

export const HighlightProvider = ({ children }) => {
  const [highlight, setHighlightState] = useState(null);
  const timerRef = useRef(null);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setHighlightState(null);
  }, []);

  const setHighlight = useCallback((next) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHighlightState(next);
    if (next) {
      timerRef.current = setTimeout(() => {
        setHighlightState(null);
        timerRef.current = null;
      }, AUTO_CLEAR_MS);
    }
  }, []);

  const isHighlighted = useCallback(
    (kind, id) => {
      if (!highlight) return false;
      if (kind === "experience") return (highlight.experiences || []).includes(id);
      if (kind === "project")    return (highlight.projects    || []).includes(id);
      if (kind === "skill")      return (highlight.skills      || []).includes(id);
      return false;
    },
    [highlight]
  );

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <HighlightContext.Provider value={{ highlight, setHighlight, clear, isHighlighted }}>
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => useContext(HighlightContext);
