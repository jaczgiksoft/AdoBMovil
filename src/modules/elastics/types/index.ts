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
