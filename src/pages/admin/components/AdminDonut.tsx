type Props = {
  label: string;
  progress?: number; // 0..100
};

export default function AdminDonut({ label, progress = 65 }: Props) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle
          cx="35"
          cy="35"
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="35"
          cy="35"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-teal-700"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90 35 35)"
        />
        <circle
          cx="35"
          cy="35"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-orange-400"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset + 14}
          transform="rotate(-90 35 35)"
          opacity="0.9"
        />
      </svg>
      <div className="text-xs text-orange-700">{label}</div>
    </div>
  );
}
