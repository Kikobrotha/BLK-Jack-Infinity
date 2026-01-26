export function calculateConfidence({
  ev,
  roadAgreement,
  hands,
}: {
  ev: number;
  roadAgreement: number;
  hands: number;
}) {
  const evScore = Math.min(Math.abs(ev) * 100, 40);

  const roadScore = roadAgreement * 40;

  const maturityScore = Math.min(hands / 300, 1) * 20;

  return Math.round(evScore + roadScore + maturityScore);
}
