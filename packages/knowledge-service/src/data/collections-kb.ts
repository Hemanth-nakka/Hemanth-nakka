export interface KBArticle {
  id: string;
  title: string;
  titleTl: string;
  category: 'negotiation' | 'payment' | 'disposition' | 'ops';
  tags: string[];
  triggers: string[];
  content: string;
  contentTl: string;
  dpd?: { min: number; max: number };
  phase?: string;
}

export const COLLECTIONS_KB: KBArticle[] = [
  {
    id: 'NEG-001',
    title: 'Opening Disclosure Script',
    titleTl: 'Script sa Pagbubukas ng Tawag',
    category: 'negotiation',
    tags: ['opening', 'mini-miranda', 'disclosure', 'compliance'],
    triggers: ['start of call', 'opening', 'introduction', 'pagpapakilala'],
    content: 'Good [morning/afternoon], this is [Agent Name] calling from [Company] regarding your account. This is an attempt to collect a debt and any information obtained will be used for that purpose. Am I speaking with [Customer Name]?',
    contentTl: 'Magandang [umaga/hapon], ito si [Pangalan ng Ahente] na tumatawag mula sa [Kumpanya] tungkol sa iyong account. Ito ay isang pagtatangkang mangolekta ng utang at anumang impormasyong nakuha ay gagamitin para sa layuning iyon. Kausap ko po ba si [Pangalan ng Customer]?',
  },
  {
    id: 'NEG-002',
    title: 'Hardship Negotiation',
    titleTl: 'Negosasyon sa Kahirapan',
    category: 'negotiation',
    tags: ['hardship', 'extension', 'deferral', 'empathy'],
    triggers: ['wala pong trabaho', 'nawalan ng trabaho', 'sakit', 'hospitalized', 'no income', 'walang pera', 'hardship'],
    content: 'I understand you\'re going through a difficult time. Let me check what options are available for your situation. We have hardship programs that may allow a payment deferral or restructured plan. Can you tell me more about your current situation so I can find the best option?',
    contentTl: 'Naiintindihan ko na mahirap ang iyong kalagayan ngayon. Tingnan natin kung anong mga opsyon ang available para sa iyo. Mayroon kaming mga programa para sa mahirap na sitwasyon na maaaring magbigay ng deferral o restructured na plano. Maaari mo bang sabihin sa akin ang higit pa tungkol sa iyong kasalukuyang kalagayan para mahanap ko ang pinakamahusay na opsyon?',
    dpd: { min: 0, max: 180 },
  },
  {
    id: 'NEG-003',
    title: 'Dispute Handling',
    titleTl: 'Paghahawak ng Dispute',
    category: 'negotiation',
    tags: ['dispute', 'fraud', 'investigation', 'escalation'],
    triggers: ['hindi ko utang', 'hindi ko alam', 'di ko kilala', 'fraud', 'scam', 'di ko ginawa', 'dispute'],
    content: 'I hear your concern. I\'ll note your dispute on the account right now. You have the right to dispute this in writing within 30 days. I will pause collection activity and escalate this to our disputes team. You will receive written confirmation within 5 business days.',
    contentTl: 'Naiintindihan ko ang iyong alalahanin. Itatala ko na ang iyong dispute sa account ngayon. Mayroon kang karapatang mag-dispute ng ito sa sulat sa loob ng 30 araw. Ipagpapaliban ko ang aktibidad ng koleksyon at ie-escalate ito sa aming disputes team. Makakatanggap ka ng nakasulat na kumpirmasyon sa loob ng 5 araw ng negosyo.',
  },
  {
    id: 'PAY-001',
    title: 'Payment Channels',
    titleTl: 'Mga Paraan ng Pagbabayad',
    category: 'payment',
    tags: ['payment', 'gcash', 'bank', 'channels', 'how to pay'],
    triggers: ['how to pay', 'paano magbayad', 'payment channel', 'gcash', 'bayad', 'saan magbayad'],
    content: 'You can pay through: (1) GCash — transfer to [merchant number]; (2) Online banking — [bank details]; (3) Over-the-counter — any [partner bank] branch; (4) 7-Eleven/Bayad Center using reference number [REF]. All payments post within 24–48 hours.',
    contentTl: 'Maaari kang magbayad sa pamamagitan ng: (1) GCash — i-transfer sa [merchant number]; (2) Online banking — [bank details]; (3) Over-the-counter — anumang sangay ng [partner bank]; (4) 7-Eleven/Bayad Center gamit ang reference number [REF]. Lahat ng bayad ay nipo-post sa loob ng 24–48 na oras.',
  },
  {
    id: 'DIS-001',
    title: 'Disposition Codes Reference',
    titleTl: 'Sanggunian sa mga Disposition Code',
    category: 'disposition',
    tags: ['disposition', 'codes', 'outcome', 'PTP', 'RTP'],
    triggers: ['disposition', 'outcome', 'what code', 'anong code', 'log call'],
    content: 'PTP=Promise to Pay (get date+amount), PPA=Partial Payment Arrangement, RTP=Refused to Pay, DISP=Dispute Raised, HARD=Hardship Identified, NC=No Contact/No Answer, CB=Call Back (schedule next contact), LEGAL=Escalate to Legal, PM=Payment Made.',
    contentTl: 'PTP=Pangako na Magbabayad (kumuha ng petsa+halaga), PPA=Bahagyang Ayos ng Pagbabayad, RTP=Tumanggi na Magbayad, DISP=Dispute na Itinataas, HARD=Nahiwatig na Kahirapan, NC=Walang Kontak/Walang Sagot, CB=Tumawag Muli (mag-iskedyul ng susunod na kontak), LEGAL=I-escalate sa Legal, PM=Nagbayad na.',
  },
  {
    id: 'OPS-001',
    title: 'Supervisor Escalation Procedure',
    titleTl: 'Pamamaraan ng Pag-escalate sa Superbisor',
    category: 'ops',
    tags: ['supervisor', 'escalation', 'manager', 'complaint', 'ops'],
    triggers: ['supervisor', 'manager', 'superbisor', 'escalate', 'i-escalate', 'complaint'],
    content: 'To escalate: (1) Advise customer you are transferring to a supervisor; (2) Place call on hold; (3) Brief supervisor — account, issue, customer mood; (4) Warm transfer. Document reason in notes field. If supervisor unavailable, schedule callback within 2 hours.',
    contentTl: 'Para mag-escalate: (1) Ipaalam sa customer na ililipat mo sila sa superbisor; (2) Ilagay ang tawag sa hold; (3) I-brief ang superbisor — account, isyu, mood ng customer; (4) Warm transfer. Idokumento ang dahilan sa notes field. Kung hindi available ang superbisor, mag-iskedyul ng callback sa loob ng 2 oras.',
    phase: '1B',
  },
];
