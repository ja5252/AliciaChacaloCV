import { DocumentMetadata, DocType } from './types';

// In a real app, this would come from your Google Cloud Storage / Database
export const MOCK_DOCUMENTS: DocumentMetadata[] = [
  {
    id: '1',
    title: 'Ph.D. Diploma in Biology',
    originalTitle: 'Título de Doctorado en Biología',
    description: 'Official diploma certifying the completion of Ph.D. studies at UNAM.',
    date: '1995-06-15',
    year: 1995,
    category: 'Education',
    tags: ['university', 'degree', 'science'],
    type: DocType.JPG,
    thumbnailUrl: 'https://picsum.photos/400/600?random=1',
    content: 'UNIVERSIDAD NACIONAL AUTÓNOMA DE MÉXICO. OTORGA A ALICIA CHACALO HILÚ EL GRADO DE DOCTORA EN CIENCIAS BIOLÓGICAS. CIUDAD UNIVERSITARIA, 1995.'
  },
  {
    id: '2',
    title: 'National Researcher Award',
    originalTitle: 'Premio Nacional de Investigadores',
    description: 'Recognition for outstanding contribution to urban ecology research.',
    date: '2005-11-20',
    year: 2005,
    category: 'Awards',
    tags: ['merit', 'research', 'ecology'],
    type: DocType.PDF,
    thumbnailUrl: 'https://picsum.photos/400/500?random=2',
    content: 'El Consejo Nacional de Ciencia y Tecnología otorga el presente RECONOCIMIENTO a la Dra. Alicia Chacalo por su trayectoria.'
  },
  {
    id: '3',
    title: 'Conference on Urban Trees',
    originalTitle: 'Conferencia sobre Arbolado Urbano',
    description: 'Keynote speech transcript and presentation slides from the International Arboriculture Summit.',
    date: '2012-03-10',
    year: 2012,
    category: 'Speaking',
    tags: ['conference', 'international', 'trees'],
    type: DocType.PDF,
    thumbnailUrl: 'https://picsum.photos/400/550?random=3',
    content: 'Ponencia Magistral: La importancia del árbol en la ciudad moderna. Presentada ante el comite internacional.'
  },
  {
    id: '4',
    title: 'UAM Professor Appointment',
    originalTitle: 'Nombramiento Profesor UAM',
    description: 'Official appointment letter as Titular Professor C at UAM Azcapotzalco.',
    date: '1990-09-01',
    year: 1990,
    category: 'Professional Experience',
    tags: ['employment', 'teaching', 'tenure'],
    type: DocType.JPG,
    thumbnailUrl: 'https://picsum.photos/400/600?random=4',
    content: 'Universidad Autónoma Metropolitana. Se hace constar el nombramiento definitivo como Profesor Titular C.'
  },
  {
    id: '5',
    title: 'Scientific Publication: Root Systems',
    originalTitle: 'Publicación Científica: Sistemas Radicales',
    description: 'Article published in the Journal of Arboriculture regarding expansive root systems.',
    date: '2001-07-15',
    year: 2001,
    category: 'Publications',
    tags: ['journal', 'science', 'research'],
    type: DocType.PDF,
    thumbnailUrl: 'https://picsum.photos/400/500?random=5',
    content: 'Abstract: Study of root systems in compacted soils within Mexico City urban areas.'
  },
  {
    id: '6',
    title: 'Masters Degree Certificate',
    originalTitle: 'Certificado de Maestría',
    description: 'Certificate of completion for Masters in Environmental Sciences.',
    date: '1988-05-20',
    year: 1988,
    category: 'Education',
    tags: ['university', 'degree'],
    type: DocType.JPG,
    thumbnailUrl: 'https://picsum.photos/400/600?random=6',
    content: 'Certificado de Estudios de Posgrado. Maestría en Ciencias Ambientales.'
  },
  {
    id: '7',
    title: 'Urban Reforestation Project: Mexico City',
    originalTitle: 'Proyecto de Reforestación Urbana CDMX',
    description: 'Comprehensive plan and execution report for the reforestation of main avenues in Mexico City.',
    date: '2008-04-22',
    year: 2008,
    category: 'Projects',
    tags: ['environment', 'urban planning', 'management'],
    type: DocType.PDF,
    thumbnailUrl: 'https://picsum.photos/400/550?random=7',
    content: 'Informe final del proyecto de reforestación. Se plantaron 5000 árboles de especies nativas.'
  },
  {
    id: '8',
    title: 'Certified Arborist Credential',
    originalTitle: 'Credencial de Arborista Certificado',
    description: 'Certification from the International Society of Arboriculture (ISA).',
    date: '1998-01-15',
    year: 1998,
    category: 'Certifications',
    tags: ['certification', 'isa', 'professional'],
    type: DocType.PNG,
    thumbnailUrl: 'https://picsum.photos/400/300?random=8',
    content: 'International Society of Arboriculture. Certified Arborist. Alicia Chacalo Hilú.'
  }
];

export const CATEGORIES = [
  'All',
  'Education',
  'Professional Experience',
  'Projects',
  'Certifications',
  'Awards',
  'Publications',
  'Speaking',
  'Press'
];

export const YEARS = Array.from({ length: 40 }, (_, i) => 2024 - i); // Last 40 years
