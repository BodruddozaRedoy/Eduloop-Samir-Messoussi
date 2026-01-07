import { User } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
};

export default function AdminHeader({ title, subtitle }: Props) {
  return (
    <header className="flex items-center justify-between bg-orange-600 py-4 pl-16 pr-4 text-white sm:px-6 sm:py-6 lg:px-10">
      <div>
        <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-xs/5 text-white/90">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70">
        <User className="h-5 w-5" />
      </div>
    </header>
  );
}
