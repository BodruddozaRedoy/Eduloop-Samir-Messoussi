import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  value: string;
  helper?: string;
};

export default function AdminStatCard({ icon, title, value, helper }: Props) {
  return (
    <div className="rounded-xl bg-orange-50 px-6 py-5 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600">
        {icon}
      </div>
      <div className="text-xs font-semibold text-orange-700">{title}</div>
      <div className="mt-1 text-[11px] text-gray-500">{value}</div>
      {helper ? <div className="mt-1 text-[10px] text-gray-400">{helper}</div> : null}
    </div>
  );
}
