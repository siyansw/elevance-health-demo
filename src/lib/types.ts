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
  brandNames?: string[];
  manufacturer: string;
  fdaApprovalDate: string;
  drugClass?: string;
  dosingSchedule?: string;
  indications: string[];
  efficacyRate: number;
  adverseEvents: number;
  costPerYear: number;
  hba1cReduction?: number;
  hba1cRange?: string;
  weightLoss?: number;
  weightLossRange?: string;
  cvBenefit?: string;
  maceReduction?: number | null;
  easiImprovement?: number;
  igaClearance?: number;
}

export interface ClinicalTrial {
  id: string;
  name?: string;
  phase: string;
  trialType?: string;
  participants: number;
  population?: string;
  duration?: string;
  primaryOutcome: string;
  comparator?: string;
  result: string;
  maceResults?: {
    treatment: number;
    control: number;
    hazardRatio: number;
    confidenceInterval: string;
    pValue: string;
  };
  hba1cResults?: {
    treatment: number;
    control: number;
  };
  weightResults?: {
    treatment: number;
    control: number;
  };
  publicationDate: string;
  nctId?: string;
  publicationLink?: string;
}

export interface SafetyData {
  blackBoxWarnings?: string[];
  adverseEvents: Array<{
    event: string;
    treatmentRate: number;
    controlRate: number;
  }>;
  seriousAdverseEvents?: Array<{
    event: string;
    incidence: number;
    notes?: string;
  }>;
  warnings?: string[];
  discontinuationRate?: number;
}

export interface EvidenceQuality {
  totalTrials: number;
  trialSeries?: string;
  totalPatients: number;
  durationRange?: string;
  rctCount?: number;
  doubleBlindCount?: number;
  activeControlCount?: number;
  hasCVOT: boolean;
  population?: {
    meanAge?: number;
    ageRange?: string;
    femalePercent?: number;
    baselineHbA1c?: number;
    diabetesDuration?: number;
    racialBreakdown?: {
      white?: number;
      black?: number;
      asian?: number;
    };
  };
}

export interface FormularyStatus {
  medicareCoverage?: {
    coveragePercent: number;
    tierDistribution: {
      tier1?: number;
      tier2?: number;
      tier3?: number;
      tier4?: number;
      tier5?: number;
    };
  };
  pbmStatus?: Array<{
    pbm: string;
    status: string;
    tier: number;
    notes?: string;
  }>;
  vaFormulary?: {
    status: string;
    criteria?: string;
  };
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

export interface AISummary {
  executiveSummary: string;
  keyHighlights: string[];
  recentNews: Array<{
    headline: string;
    source: string;
    date: string;
    summary: string;
  }>;
}

export interface ExecutionResult {
  success: boolean;
  duration: number;
  summary: string;
  details: {
    sourcesQueried?: number;
    dataPointsAnalyzed?: number;
    recommendationsGenerated?: number;
    aiSummary?: AISummary;
    drugProfile?: DrugProfile;
    clinicalTrials?: ClinicalTrial[];
    guidelines?: GuidelineRecommendation[];
    paCriteria?: PACriteria[];
    safetyData?: SafetyData;
    evidenceQuality?: EvidenceQuality;
    formularyStatus?: FormularyStatus;
    comparatorDrugs?: Array<{
      name: string;
      efficacy: number;
      cost: number;
      hba1c?: number;
      weightLoss?: number;
      maceReduction?: number;
    }>;
    updates?: Array<{
      type: 'safety' | 'indication' | 'guideline';
      message: string;
      date: string;
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
