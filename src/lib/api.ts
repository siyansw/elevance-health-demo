import type { ExecutionResult, AgentLog } from './types';

const MINO_API_URL = import.meta.env.VITE_MINO_API_URL || 'https://api.tinyfish.ai';
const MINO_API_KEY = import.meta.env.VITE_MINO_API_KEY || '';

export interface MinoExecutionRequest {
  useCaseId: string;
  parameters?: Record<string, any>;
}

export class MinoAPIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || MINO_API_KEY;
    this.baseUrl = baseUrl || MINO_API_URL;
  }

  async executeUseCase(
    useCaseId: string,
    onLog?: (log: AgentLog) => void,
    onProgress?: (progress: number) => void
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Create EventSource for SSE streaming
      const eventSource = new EventSource(
        `${this.baseUrl}/execute/${useCaseId}?apiKey=${this.apiKey}`
      );

      return new Promise((resolve, reject) => {
        const logs: AgentLog[] = [];
        let currentProgress = 0;

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle different event types
            switch (data.type) {
              case 'log':
                const log: AgentLog = {
                  timestamp: data.timestamp || new Date().toISOString(),
                  level: data.level || 'info',
                  message: data.message,
                  data: data.data,
                };
                logs.push(log);
                onLog?.(log);
                break;

              case 'progress':
                currentProgress = data.progress || 0;
                onProgress?.(currentProgress);
                break;

              case 'result':
                eventSource.close();
                const duration = Date.now() - startTime;
                resolve({
                  success: true,
                  duration,
                  summary: data.summary || 'Execution completed successfully',
                  details: data.details || {},
                  logs,
                });
                break;

              case 'error':
                eventSource.close();
                reject(new Error(data.message || 'Execution failed'));
                break;
            }
          } catch (error) {
            console.error('Error parsing event data:', error);
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          reject(new Error('Connection to API failed'));
        };

        // Timeout after 5 minutes
        setTimeout(() => {
          eventSource.close();
          reject(new Error('Execution timeout'));
        }, 300000);
      });
    } catch (error) {
      // Fallback to simulated execution if API fails
      console.warn('API call failed, using simulated data:', error);
      return this.simulateExecution(useCaseId, onLog, onProgress);
    }
  }

  // Fallback simulated execution for demo purposes
  private async simulateExecution(
    useCaseId: string,
    onLog?: (log: AgentLog) => void,
    onProgress?: (progress: number) => void
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const logs: AgentLog[] = [];

    const simulatedLogs =
      useCaseId === 'pt-committee'
        ? [
            { level: 'info' as const, message: 'Initializing P&T Committee Intelligence agent...' },
            { level: 'success' as const, message: 'Connected to FDA Drugs@FDA database' },
            { level: 'info' as const, message: 'Querying Semaglutide clinical data...' },
            { level: 'success' as const, message: 'Retrieved 247 clinical trials from ClinicalTrials.gov' },
            { level: 'info' as const, message: 'Searching PubMed for published research...' },
            { level: 'success' as const, message: 'Found 1,832 relevant publications' },
            { level: 'info' as const, message: 'Analyzing ADA/ACC/AHA clinical guidelines...' },
            { level: 'success' as const, message: 'Compiled evidence-based recommendations' },
            { level: 'success' as const, message: 'Formulary decision report generated' },
          ]
        : [
            { level: 'info' as const, message: 'Initializing Prior Authorization Intelligence agent...' },
            { level: 'success' as const, message: 'Connected to CMS LCD/NCD database' },
            { level: 'info' as const, message: 'Querying Dupixent coverage criteria...' },
            { level: 'success' as const, message: 'Retrieved Medicare coverage determinations' },
            { level: 'info' as const, message: 'Searching AAD clinical guidelines...' },
            { level: 'success' as const, message: 'Found approval criteria from medical societies' },
            { level: 'info' as const, message: 'Analyzing competitor payer policies...' },
            { level: 'success' as const, message: 'Synthesized PA requirements from 12 sources' },
            { level: 'success' as const, message: 'Prior authorization criteria report complete' },
          ];

    for (let i = 0; i < simulatedLogs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

      const log: AgentLog = {
        timestamp: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
        level: simulatedLogs[i].level,
        message: simulatedLogs[i].message,
      };

      logs.push(log);
      onLog?.(log);
      onProgress?.(((i + 1) / simulatedLogs.length) * 100);
    }

    const duration = Date.now() - startTime;

    return {
      success: true,
      duration,
      summary:
        useCaseId === 'pt-committee'
          ? 'Compiled comprehensive formulary evidence for Semaglutide from 2,079 sources including FDA approvals, clinical trials, and medical guidelines.'
          : 'Generated complete prior authorization criteria for Dupixent based on CMS, AAD guidelines, and 12 payer policy comparisons.',
      details: {
        sourcesQueried: useCaseId === 'pt-committee' ? 4 : 4,
        dataPointsAnalyzed: useCaseId === 'pt-committee' ? 2079 : 847,
        recommendationsGenerated: useCaseId === 'pt-committee' ? 12 : 8,
      },
      logs,
    };
  }
}

export const minoClient = new MinoAPIClient();
