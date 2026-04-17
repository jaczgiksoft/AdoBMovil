import { ElasticInstruction } from '../types';

export const ELASTIC_INSTRUCTIONS: ElasticInstruction[] = [
  {
    id: '1',
    title: 'Class II Correction',
    startDate: '2026-03-01',
    endDate: '2026-03-20',
    dailyHours: 20,
    elastics: [
      { type: 'Heavy', color: 'red' },
      { type: 'Medium', color: 'purple' },
    ],
    instructions:
      'Use elastics from upper canine to lower molar. Replace elastics 3 times per day.',
    imagePath: '/example/instrucciones.png',
    status: 'active',
  },
  {
    id: '2',
    title: 'Midline Adjustment',
    startDate: '2026-02-10',
    endDate: '2026-02-25',
    dailyHours: 18,
    elastics: [
      { type: 'Medium', color: 'purple' },
    ],
    instructions:
      'Wear elastics on the right side only. Remove only during meals.',
    imagePath: '/example/instrucciones.png',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Final Detailing',
    startDate: '2026-03-25',
    endDate: '2026-04-10',
    dailyHours: 16,
    elastics: [
      { type: 'Light', color: 'blue' },
    ],
    instructions:
      'Light elastics for finishing. Use mostly during nighttime.',
    imagePath: '/example/instrucciones.png',
    status: 'upcoming',
  },
];

export const getElasticsMock = async (): Promise<ElasticInstruction[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(ELASTIC_INSTRUCTIONS), 500));
};
