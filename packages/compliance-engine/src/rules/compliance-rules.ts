export interface ComplianceRule {
  id: string;
  regulation: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  patterns: RegExp[];
  agentCue: string;
  agentCueTl: string;
  autoEscalate: boolean;
  speaker: 'agent' | 'customer' | 'both';
}

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'BSP-001',
    regulation: 'BSP Circular 1048 §4(b)',
    category: 'Threat / Legal',
    severity: 'critical',
    patterns: [/kulong|kulungan|ikulong|court case|i-sue|mag-file ng kaso|legal action|i-report sa pulis/i],
    agentCue: 'Do NOT threaten legal action or arrest. Stick to factual payment consequences.',
    agentCueTl: 'HUWAG magbanta ng legal na aksyon o pag-aresto. Manatili sa katotohanan ng mga kahihinatnan ng pagbabayad.',
    autoEscalate: true,
    speaker: 'agent',
  },
  {
    id: 'BSP-002',
    regulation: 'BSP Circular 1048 §4(b)',
    category: 'Threat / Property',
    severity: 'critical',
    patterns: [/confiscate|i-confiscate|kukunin|property|blacklist|credit bureau|bangko sentral/i],
    agentCue: 'Do NOT threaten to seize property or blacklist. Only state factual credit reporting consequences.',
    agentCueTl: 'HUWAG magbanta ng pag-confiscate ng ari-arian o pag-blacklist. Sabihin lamang ang katotohanang kahihinatnan sa credit.',
    autoEscalate: false,
    speaker: 'agent',
  },
  {
    id: 'NPC-001',
    regulation: 'RA 10173 (Data Privacy Act)',
    category: 'Third-party Disclosure',
    severity: 'critical',
    patterns: [/sasabihin sa|ipapaalam sa|kontakin ang|your (boss|employer|family|neighbor|kapitbahay|employer|supervisor)/i],
    agentCue: 'STOP — do not contact or disclose debt to third parties. This violates RA 10173.',
    agentCueTl: 'TIGIL — huwag makipag-ugnayan o ibahagi ang utang sa mga third party. Ito ay paglabag sa RA 10173.',
    autoEscalate: true,
    speaker: 'agent',
  },
  {
    id: 'BSP-003',
    regulation: 'BSP Circular 1048 §4(c)',
    category: 'Harassment',
    severity: 'high',
    patterns: [/paulit-ulit na tatawag|magtatawag ng maraming beses|hindi ka makakatulog|paabutin sa|follow you/i],
    agentCue: 'Avoid language suggesting repeated harassment. Offer a specific follow-up call window.',
    agentCueTl: 'Iwasan ang mga salitang nagmumungkahi ng paulit-ulit na panliligalig. Mag-alok ng isang tiyak na window para sa follow-up na tawag.',
    autoEscalate: false,
    speaker: 'agent',
  },
  {
    id: 'BSP-004',
    regulation: 'BSP Circular 1048 §4(d)',
    category: 'Misrepresentation',
    severity: 'high',
    patterns: [/pulis ako|abogado ako|hukom|i am a lawyer|i am a police|government agent|bangko mismo/i],
    agentCue: 'Do NOT misrepresent identity or authority. Always identify yourself as a collections agent.',
    agentCueTl: 'HUWAG magpanggap ng ibang pagkakakilanlan o awtoridad. Palaging kilalanin ang iyong sarili bilang isang ahente ng koleksyon.',
    autoEscalate: true,
    speaker: 'agent',
  },
  {
    id: 'NPC-002',
    regulation: 'RA 10173 (Data Privacy Act)',
    category: 'Sensitive Data',
    severity: 'high',
    patterns: [/account number|credit card number|pin|password|mother'?s maiden name/i],
    agentCue: 'Do not request full account numbers, PINs, or passwords over the phone.',
    agentCueTl: 'Huwag humiling ng buong account number, PIN, o password sa telepono.',
    autoEscalate: false,
    speaker: 'agent',
  },
  {
    id: 'INT-001',
    regulation: 'Internal Policy',
    category: 'Missing Mini-Miranda',
    severity: 'medium',
    patterns: [],
    agentCue: 'Reminder: deliver the Mini-Miranda disclosure — "This is an attempt to collect a debt. Any information obtained will be used for that purpose."',
    agentCueTl: 'Paalala: ibigay ang Mini-Miranda disclosure — "Ito ay isang pagtatangkang mangolekta ng utang. Anumang impormasyong nakuha ay gagamitin para sa layuning iyon."',
    autoEscalate: false,
    speaker: 'agent',
  },
];
