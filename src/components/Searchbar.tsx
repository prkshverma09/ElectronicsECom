"use client";

import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

interface SearchbarProps {
  onSearch: (query: string) => void;
  value: string;
}

export function Searchbar({ onSearch, value }: SearchbarProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search for electronics..."
        className="pl-10 h-12 rounded-full border-primary/20 bg-white/5 backdrop-blur-sm focus-visible:ring-primary/40 transition-all"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
