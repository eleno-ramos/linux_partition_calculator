import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "pt" | "en" | "es" | "fr";

interface GeolocationData {
  country: string;
  countryCode: string;
  continent: string;
  latitude: string;
  longitude: string;
}

interface GeolocationContextType {
  geolocation: GeolocationData | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(
  undefined
);

export function GeolocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [geolocation, setGeolocation] = useState<GeolocationData | null>(null);
  const [language, setLanguageState] = useState<Language>("pt");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectGeolocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        setGeolocation({
          country: data.country_name || "Unknown",
          countryCode: data.country_code || "XX",
          continent: data.continent || "Unknown",
          latitude: data.latitude?.toString() || "0",
          longitude: data.longitude?.toString() || "0",
        });

        const detectedLanguage = getLanguageByCountry(data.country_code);
        setLanguageState(detectedLanguage);
        localStorage.setItem("preferredLanguage", detectedLanguage);
      } catch (error) {
        console.error("Erro ao detectar geolocalização:", error);
        const browserLang = navigator.language.split("-")[0];
        const fallbackLang = isValidLanguage(browserLang)
          ? (browserLang as Language)
          : "pt";
        setLanguageState(fallbackLang);
        localStorage.setItem("preferredLanguage", fallbackLang);
      } finally {
        setIsLoading(false);
      }
    };

    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage && isValidLanguage(savedLanguage)) {
      setLanguageState(savedLanguage as Language);
      setIsLoading(false);
    } else {
      detectGeolocation();
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  return (
    <GeolocationContext.Provider
      value={{ geolocation, language, setLanguage, isLoading }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error(
      "useGeolocation deve ser usado dentro de GeolocationProvider"
    );
  }
  return context;
}

function getLanguageByCountry(countryCode: string): Language {
  const languageMap: Record<string, Language> = {
    BR: "pt",
    PT: "pt",
    AO: "pt",
    MZ: "pt",
    CV: "pt",
    ST: "pt",
    TL: "pt",
    ES: "es",
    MX: "es",
    AR: "es",
    CO: "es",
    PE: "es",
    VE: "es",
    CL: "es",
    FR: "fr",
    BE: "fr",
    CH: "fr",
    LU: "fr",
    US: "en",
    GB: "en",
    AU: "en",
    NZ: "en",
    IE: "en",
    IN: "en",
    ZA: "en",
    SG: "en",
  };

  return languageMap[countryCode] || "en";
}

function isValidLanguage(lang: string): boolean {
  return ["pt", "en", "es", "fr"].includes(lang);
}
