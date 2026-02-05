import type { ExecutionResult } from './types';

const STORAGE_KEY = 'elevance-execution-results';

export interface StoredResults {
  [useCaseId: string]: {
    result: ExecutionResult;
    timestamp: string;
  };
}

export const storage = {
  saveResult(useCaseId: string, result: ExecutionResult): void {
    try {
      const existing = this.getAllResults();
      existing[useCaseId] = {
        result,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save result:', error);
    }
  },

  getResult(useCaseId: string): ExecutionResult | null {
    try {
      const results = this.getAllResults();
      return results[useCaseId]?.result || null;
    } catch (error) {
      console.error('Failed to get result:', error);
      return null;
    }
  },

  getAllResults(): StoredResults {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get all results:', error);
      return {};
    }
  },

  clearResults(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear results:', error);
    }
  },

  clearResult(useCaseId: string): void {
    try {
      const results = this.getAllResults();
      delete results[useCaseId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Failed to clear result:', error);
    }
  },
};
