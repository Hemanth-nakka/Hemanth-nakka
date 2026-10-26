import { COMPLIANCE_RULES, ComplianceRule } from '../rules/compliance-rules';

export interface ComplianceAlert {
  ruleId: string;
  regulation: string;
  category: string;
  severity: ComplianceRule['severity'];
  agentCue: string;
  agentCueTl: string;
  autoEscalate: boolean;
  triggeredText: string;
  conversationId: string;
  timestamp: string;
}

export class ComplianceDetector {
  private readonly seen = new Map<string, Set<string>>();
  private readonly exchangeCounts = new Map<string, number>();

  check(
    conversationId: string,
    text: string,
    speaker: 'agent' | 'customer'
  ): ComplianceAlert[] {
    const alerts: ComplianceAlert[] = [];
    const seen = this.seen.get(conversationId) ?? new Set();

    const exchanges = (this.exchangeCounts.get(conversationId) || 0) + 1;
    this.exchangeCounts.set(conversationId, exchanges);

    for (const rule of COMPLIANCE_RULES) {
      if (rule.id === 'INT-001') {
        if (exchanges === 3 && speaker === 'agent' && !seen.has('INT-001')) {
          const miniMiranda = /attempt to collect|collecting a debt|information.*used/i;
          const history = text;
          if (!miniMiranda.test(history)) {
            seen.add('INT-001');
            alerts.push(this.buildAlert(rule, '[Missing opening disclosure]', conversationId));
          }
        }
        continue;
      }

      if (rule.speaker !== 'both' && rule.speaker !== speaker) continue;
      if (seen.has(rule.id)) continue;

      if (rule.patterns.some((p) => p.test(text))) {
        seen.add(rule.id);
        alerts.push(this.buildAlert(rule, text, conversationId));
      }
    }

    this.seen.set(conversationId, seen);
    return alerts;
  }

  private buildAlert(rule: ComplianceRule, text: string, conversationId: string): ComplianceAlert {
    return {
      ruleId: rule.id,
      regulation: rule.regulation,
      category: rule.category,
      severity: rule.severity,
      agentCue: rule.agentCue,
      agentCueTl: rule.agentCueTl,
      autoEscalate: rule.autoEscalate,
      triggeredText: text.slice(0, 120),
      conversationId,
      timestamp: new Date().toISOString(),
    };
  }
}
