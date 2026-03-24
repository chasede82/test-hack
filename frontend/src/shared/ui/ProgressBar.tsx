"use client";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  variant?: "blue" | "green" | "red";
}

const barColors: Record<string, string> = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  red: "bg-red-600",
};

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  variant = "blue",
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-1 flex items-center justify-between text-sm">
          {label && <span className="text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-gray-900">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${barColors[variant]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
