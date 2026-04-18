export type ElasticInstruction = {
  id: string;
  title: string;

  startDate: string;
  endDate: string;

  dailyHours: number;

  elastics: {
    type: 'Heavy' | 'Medium' | 'Light';
    color: string;
  }[];

  instructions: string;

  imagePath: string;

  status: 'active' | 'completed' | 'upcoming';
};

export interface PatientElastic {
  id: number;
  patient_id: number;
  tenant_id: number;
  upper_elastic: string | null;
  lower_elastic: string | null;
  notes: string | null;
  start_date: string | null;
  end_date: string | null;
  hours: string | null;
  odontogram_data: any;
  preview_image_url: string | null;
  created_at: string;
  updated_at: string;
}
