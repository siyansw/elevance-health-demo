export interface UseCaseConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedTime: string;
  category: string;
  gradient: string;
}

export interface AgentLog {
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

export interface ExecutionResult {
  success: boolean;
  duration: number;
  summary: string;
  details: any;
  logs: AgentLog[];
}

export interface StreamEvent {
  type: 'log' | 'progress' | 'result' | 'error';
  data: any;
  timestamp: string;
}

export type ExecutionMode = 'demo' | 'live';

export interface UseCaseExecution {
  useCaseId: string;
  mode: ExecutionMode;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'error';
  result?: ExecutionResult;
}
