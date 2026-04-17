export interface TreatmentPhase {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface TreatmentSummary {
  id: string;
  title: string;
  overallProgress: number; // 0 to 100
  phases: TreatmentPhase[];
}
