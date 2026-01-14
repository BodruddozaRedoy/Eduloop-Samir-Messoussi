import { Search } from "lucide-react";
import type { ChangeEventHandler } from "react";

type SelectProps = {
  placeholder: string;
};

export function AdminSelect({ placeholder }: SelectProps) {
  return (
    <select className="h-9 w-36 rounded-lg bg-orange-50 px-3 text-xs text-orange-700 outline-none">
      <option>{placeholder}</option>
    </select>
  );
}

type SearchProps = {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export function AdminSearch({ placeholder = "Search", value, onChange }: SearchProps) {
  return (
    <div className="relative w-[320px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
