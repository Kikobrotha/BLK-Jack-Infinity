export default function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className="w-full mt-3">
      <div className="text-sm mb-1">Confidence</div>
      <div className="w-full bg-gray-700 h-3 rounded">
        <div
          className="h-3 rounded bg-yellow-400 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="text-xs mt-1">{value}%</div>
    </div>
  );
}
