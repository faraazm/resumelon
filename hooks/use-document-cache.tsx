"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Types for cached documents
interface CachedResume {
  _id: Id<"resumes">;
  title: string;
  updatedAt: number;
  template: string;
  personalDetails?: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    photo?: string;
  };
  contact?: {
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary?: string;
  experience?: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education?: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>;
  skills?: string[];
  style?: {
    font: string;
    headingFont?: string;
    bodyFont?: string;
    spacing: string;
    accentColor: string;
    backgroundColor?: string;
    showPhoto?: boolean;
    showDividers?: boolean;
  };
  sectionOrder?: string[];
}

interface CachedCoverLetter {
  _id: Id<"coverLetters">;
  title: string;
  updatedAt: number;
  personalDetails?: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
  };
  letterContent?: {
    companyName: string;
    hiringManagerName: string;
    content: string;
  };
  template?: string;
  style?: {
    font: string;
    headingFont?: string;
    bodyFont?: string;
    spacing: string;
    accentColor: string;
    backgroundColor?: string;
  };
}

interface DocumentCacheContextValue {
  // Resumes
  cachedResumes: CachedResume[] | null;
  setCachedResumes: (resumes: CachedResume[]) => void;
  // Cover Letters
  cachedCoverLetters: CachedCoverLetter[] | null;
  setCachedCoverLetters: (letters: CachedCoverLetter[]) => void;
}

const DocumentCacheContext = createContext<DocumentCacheContextValue>({
  cachedResumes: null,
  setCachedResumes: () => {},
  cachedCoverLetters: null,
  setCachedCoverLetters: () => {},
});

export function DocumentCacheProvider({ children }: { children: React.ReactNode }) {
  const [cachedResumes, setCachedResumesState] = useState<CachedResume[] | null>(null);
  const [cachedCoverLetters, setCachedCoverLettersState] = useState<CachedCoverLetter[] | null>(null);

  const setCachedResumes = useCallback((resumes: CachedResume[]) => {
    setCachedResumesState(resumes);
  }, []);

  const setCachedCoverLetters = useCallback((letters: CachedCoverLetter[]) => {
    setCachedCoverLettersState(letters);
  }, []);

  return (
    <DocumentCacheContext.Provider
      value={{
        cachedResumes,
        setCachedResumes,
        cachedCoverLetters,
        setCachedCoverLetters,
      }}
    >
      {children}
    </DocumentCacheContext.Provider>
  );
}

export function useDocumentCache() {
  return useContext(DocumentCacheContext);
}

/**
 * Hook to use cached resumes with automatic cache updates.
 * Returns cached data immediately while fresh data loads.
 * Returns undefined only if no cached or fresh data exists.
 */
export function useCachedResumes(freshResumes: CachedResume[] | undefined): CachedResume[] | undefined {
  const { cachedResumes, setCachedResumes } = useDocumentCache();

  // Update cache when fresh data arrives
  useEffect(() => {
    if (freshResumes !== undefined) {
      setCachedResumes(freshResumes);
    }
  }, [freshResumes, setCachedResumes]);

  // Return fresh data if available, otherwise cached data (or undefined if no cache)
  if (freshResumes !== undefined) {
    return freshResumes;
  }
  return cachedResumes ?? undefined;
}

/**
 * Hook to use cached cover letters with automatic cache updates.
 * Returns cached data immediately while fresh data loads.
 * Returns undefined only if no cached or fresh data exists.
 */
export function useCachedCoverLetters(freshLetters: CachedCoverLetter[] | undefined): CachedCoverLetter[] | undefined {
  const { cachedCoverLetters, setCachedCoverLetters } = useDocumentCache();

  // Update cache when fresh data arrives
  useEffect(() => {
    if (freshLetters !== undefined) {
      setCachedCoverLetters(freshLetters);
    }
  }, [freshLetters, setCachedCoverLetters]);

  // Return fresh data if available, otherwise cached data (or undefined if no cache)
  if (freshLetters !== undefined) {
    return freshLetters;
  }
  return cachedCoverLetters ?? undefined;
}
