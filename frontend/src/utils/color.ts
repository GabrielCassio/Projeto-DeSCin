const PALETTE = [
  '#7C3AED', '#2563EB', '#059669', '#D97706',
  '#DC2626', '#0891B2', '#DB2777', '#65A30D',
];

export function getTickerColor(ticker: string): string {
  const sum = ticker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export function getTickerInitials(ticker: string): string {
  return ticker.replace('PROJ:', '').slice(0, 2);
}

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0d1a14 0%, #162b1e 100%)',
  'linear-gradient(135deg, #0d1626 0%, #162240 100%)',
  'linear-gradient(135deg, #1a1408 0%, #2c220e 100%)',
  'linear-gradient(135deg, #1a0d0d 0%, #2c1414 100%)',
  'linear-gradient(135deg, #0d1a1a 0%, #162c2c 100%)',
  'linear-gradient(135deg, #1a0d1a 0%, #2c142e 100%)',
  'linear-gradient(135deg, #121508 0%, #1c2210 100%)',
  'linear-gradient(135deg, #0d1218 0%, #141e2e 100%)',
];

export function getProjectGradient(ticker: string): string {
  const sum = ticker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_GRADIENTS[sum % CARD_GRADIENTS.length];
}
