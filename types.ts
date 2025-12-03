export interface GenderStats {
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  maleRoles: string[];
  femaleRoles: string[];
}

export interface NarrativeAnalysis {
  powerDynamics: string; // Who is active/passive, who speaks vs acts
  adjectiveAnalysis: string; // Descriptions used for genders
  socialRoles: string; // Public vs Private sphere analysis
  summary: string;
}

export interface ImprovementSuggestions {
  rewriteTips: string[];
  reflectionQuestions: string[];
}

export interface AnalysisResult {
  stats: GenderStats;
  narrative: NarrativeAnalysis;
  suggestions: ImprovementSuggestions;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  text: string;
  result: AnalysisResult;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}