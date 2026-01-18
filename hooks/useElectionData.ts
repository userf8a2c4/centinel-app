
import { useState, useEffect, useCallback } from 'react';
import { ElectionData } from '../types';

/**
 * CONFIGURACIÓN DE CONEXIÓN CON EL MOTOR
 * Repositorio: userf8a2c4/centinel-engine
 */
const CONFIG = {
  owner: "userf8a2c4",
  repo: "centinel-engine",
  path: "data/summary.json",
  branch: "main",
  engineBaseUrl: import.meta.env.VITE_ENGINE_BASE_URL as string | undefined
};

export const useElectionData = () => {
  const [data, setData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const salt = Date.now();
    const rawUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${CONFIG.path}?t=${salt}`;
    const apiUrl = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}?ref=${CONFIG.branch}`;
    const engineUrl = CONFIG.engineBaseUrl
      ? `${CONFIG.engineBaseUrl.replace(/\/+$/, '')}/${CONFIG.path}?t=${salt}`
      : null;
    const sameOriginUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/${CONFIG.path}?t=${salt}`
      : null;

    let success = false;
    let errorMessage = "";

    // INTENTO 1: Motor (datos directos desde la carpeta data del engine)
    const engineCandidates = [engineUrl, sameOriginUrl].filter(Boolean) as string[];
    for (const candidate of engineCandidates) {
      if (success) break;
      try {
        const response = await fetch(candidate, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store'
        });

        if (response.ok) {
          const jsonData: ElectionData = await response.json();
          if (jsonData && jsonData.candidates) {
            setData(jsonData);
            setError(null);
            success = true;
          }
        } else {
          errorMessage = `HTTP ${response.status} en Engine`;
        }
      } catch (e: any) {
        errorMessage = e.message;
        console.warn("Intento Engine fallido, probando fuentes de respaldo...");
      }
    }

    // INTENTO 2: GitHub Raw (Más rápido)
    if (!success) {
      try {
        const response = await fetch(rawUrl, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store'
        });

        if (response.ok) {
          const jsonData: ElectionData = await response.json();
          if (jsonData && jsonData.candidates) {
            setData(jsonData);
            setError(null);
            success = true;
          }
        } else {
          errorMessage = `HTTP ${response.status} en Raw`;
        }
      } catch (e: any) {
        errorMessage = e.message;
        console.warn("Intento Raw fallido, probando API de respaldo...");
      }
    }

    // INTENTO 3: GitHub API (Respaldo robusto si falla el primero)
    if (!success) {
      try {
        const apiResponse = await fetch(apiUrl, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (apiResponse.ok) {
          const apiJson = await apiResponse.json();
          // Decodificar Base64 de la API de GitHub
          const decodedContent = atob(apiJson.content.replace(/\s/g, ''));
          const jsonData: ElectionData = JSON.parse(decodedContent);
          
          if (jsonData && jsonData.candidates) {
            setData(jsonData);
            setError(null);
            success = true;
          }
        } else {
          errorMessage = `Error API: ${apiResponse.status}`;
        }
      } catch (apiErr: any) {
        errorMessage = `Error de red crítico: ${apiErr.message}`;
      }
    }

    if (!success) {
      setError(`FALLO DE SINCRONIZACIÓN: ${errorMessage}`);
      if (!data) setData(generateFallbackData());
    }
    
    setLoading(false);
  }, [data]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, retry: fetchData };
};

const generateFallbackData = (): ElectionData => ({
  lastUpdate: new Date().toISOString(),
  global: {
    processedPercent: 0,
    participationPercent: 0,
    totalProtocols: 0,
    trend: "CONECTANDO AL MOTOR..."
  },
  candidates: [
    { id: 'nasry', name: 'NASRY ASFURA', party: 'PNH', votes: 0, color: '#007AFF' },
    { id: 'salvador', name: 'SALVADOR NASRALLA', party: 'PLH', votes: 0, color: '#FF3B30' },
    { id: 'rixi', name: 'RIXI MONCADA', party: 'LIBRE', votes: 0, color: '#000000' }
  ],
  departments: [],
  latestProtocols: [],
  benford: Array.from({length: 9}, (_, i) => ({ digit: i+1, expected: 0, actual: 0 })),
  history: [],
  outliers: []
});
