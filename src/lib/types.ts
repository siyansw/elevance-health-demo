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

export interface DrugProfile {
  name: string;
  genericName: string;
  manufacturer: string;
  fdaApprovalDate: string;
  indications: string[];
  efficacyRate: number;
  adverseEvents: number;
  costPerYear: number;
}

export interface ClinicalTrial {
  id: string;
  phase: string;
  participants: number;
  primaryOutcome: string;
  result: string;
  publicationDate: string;
}

export interface GuidelineRecommendation {
  organization: string;
  recommendation: string;
  evidenceLevel: string;
  yearPublished: number;
}

export interface PACriteria {
  criteriaType: string;
  description: string;
  required: boolean;
}

export interface ExecutionResult {
  success: boolean;
  duration: number;
  summary: string;
  details: {
    sourcesQueried?: number;
    dataPointsAnalyzed?: number;
    recommendationsGenerated?: number;
    drugProfile?: DrugProfile;
    clinicalTrials?: ClinicalTrial[];
    guidelines?: GuidelineRecommendation[];
    paCriteria?: PACriteria[];
    comparatorDrugs?: Array<{
      name: string;
      efficacy: number;
      cost: number;
    }>;
  };
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
