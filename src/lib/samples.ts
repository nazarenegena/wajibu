import type { Language } from './types';

export interface WajibuSample {
  id: string;
  fileName: string;
  filePath: string;
  category: 'Tender' | 'Budget';
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export const samples: WajibuSample[] = [
  {
    id: 'water-meters',
    fileName: 'Nyewasco-supply-of-Water-meters.pdf',
    filePath: '/samples/Nyewasco-supply-of-Water-meters.pdf',
    category: 'Tender',
    title: {
      en: 'NYEWASCO Supply of Water Meters',
      sw: 'Ugavi wa Mita za Maji NYEWASCO',
    },
    description: {
      en: 'A Nyeri Water & Sewerage Company tender for the supply of water meters.',
      sw: 'Zabuni ya kampuni ya maji na maji taka ya Nyeri kwa ugavi wa mita za maji.',
    },
  },
  {
    id: 'sports',
    fileName: 'Nyeri-Sports-Tender.pdf',
    filePath: '/samples/Nyeri-Sports-Tender.pdf',
    category: 'Tender',
    title: {
      en: 'Nyeri County Sports Facilities Tender',
      sw: 'Zabuni ya Mifumo ya Michezo Nyeri',
    },
    description: {
      en: 'A county tender for the construction or upgrading of sports facilities.',
      sw: 'Zabuni ya kaunti kwa ujenzi au ukarabati wa mifumo ya michezo.',
    },
  },
  {
    id: 'youth',
    fileName: 'Nyeri-Youth-Tender.pdf',
    filePath: '/samples/Nyeri-Youth-Tender.pdf',
    category: 'Tender',
    title: {
      en: 'Nyeri Youth Group Tender',
      sw: 'Zabuni ya Vikundi vya Vijana Nyeri',
    },
    description: {
      en: 'A county tender with eligibility reserved for youth groups.',
      sw: 'Zabuni ya kaunti iliyohifadhiwa kwa vikundi vya vijana.',
    },
  },
];

export function getSampleById(id: string | undefined): WajibuSample | undefined {
  return samples.find((sample) => sample.id === id);
}