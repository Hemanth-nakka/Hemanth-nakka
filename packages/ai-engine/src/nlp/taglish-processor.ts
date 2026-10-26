import { NegotiationInsight } from '../types/ai.types';

const NEGOTIATION_SIGNALS: Record<string, string[]> = {
  hardship: ['wala pong trabaho', 'nawalan ng trabaho', 'hospitalized', 'emergency', 'no income', 'walang pera'],
  dispute: ['hindi ko utang', 'hindi ko alam', 'di ko kilala', 'fraud', 'scam', 'hindi ko ginawa'],
  partial: ['bahagi lang', 'partial payment', 'half muna', 'kalahati', 'some amount'],
  deferral: ['next month', 'susunod na buwan', 'wait lang', 'konting oras', 'extension'],
  promise: ['magbabayad', 'babayaran ko', 'i will pay', 'promise', 'sigurado'],
  refusal: ['hindi magbabayad', 'wag nang kontakin', 'hindi ko babayaran', 'i will not pay'],
};

const COMPLIANCE_RISK_WORDS = [
  'kulong', 'kulungan', 'pulis', 'police', 'court', 'huwes', 'abogado',
  'confiscate', 'property', 'blacklist', 'boycott', 'threat', 'banta',
  'family', 'pamilya', 'boss', 'employer', 'trabahante',
];

export function processUtterance(text: string): { signals: string[]; complianceRisk: boolean } {
  const lower = text.toLowerCase();
  const signals: string[] = [];

  for (const [signal, phrases] of Object.entries(NEGOTIATION_SIGNALS)) {
    if (phrases.some((p) => lower.includes(p))) signals.push(signal);
  }

  const complianceRisk = COMPLIANCE_RISK_WORDS.some((w) => lower.includes(w));
  return { signals, complianceRisk };
}

export function detectNegotiationPhase(exchangeCount: number, signals: string[]): NegotiationInsight['phase'] {
  if (signals.includes('refusal')) return 'escalating';
  if (signals.some((s) => ['promise', 'partial', 'deferral'].includes(s))) return 'closing';
  if (signals.some((s) => ['hardship', 'dispute'].includes(s))) return 'negotiating';
  if (exchangeCount <= 2) return 'opening';
  return 'probing';
}
