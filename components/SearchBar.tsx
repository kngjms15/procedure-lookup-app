import type { Dispatch, RefObject, SetStateAction } from "react";

type AliasItem = {
  aliasName: string;
  aliasType: string | null;
};

type ClinicItem = {
  clinic: string;
  abbreviation: string | null;
  city: string | null;
  modality: string | null;
  notes: string | null;
  radiologists?: {
    name: string;
    status: string | null;
    notes: string | null;
    genderColor: string | null;
  }[];
};

type BookingCategoryItem = {
  name: string;
  clinic: string | null;
  isPrimary: boolean;
  bookingCategoryColor: string | null;
};

type RadiologistItem = {
  name: string;
  status: string | null;
  notes: string | null;
  genderColor: string | null;
};

type Procedure = {
  id: string;
  name: string;
  displayName: string | null;
  bodyPart: string | null;
  procedureType: string | null;
  aliases: AliasItem[];
  clinics: ClinicItem[];
  bookingCategories: BookingCategoryItem[];
  radiologists: RadiologistItem[];
  internalNotes: string | null;
};

type SearchBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  isSearchFocused: boolean;
  setIsSearchFocused: Dispatch<SetStateAction<boolean>>;
  suggestions: Procedure[];
  setSelectedProcedure: Dispatch<SetStateAction<Procedure | null>>;
  getMatchingAlias: (procedure: Procedure) => AliasItem | undefined;
  inputRef: RefObject<HTMLInputElement | null>;
};

export default function SearchBar({
  search,
  setSearch,
  isSearchFocused,
  setIsSearchFocused,
  suggestions,
  setSelectedProcedure,
  getMatchingAlias,
  inputRef,
}: SearchBarProps) {
  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="w-full rounded-lg border border-slate-300 bg-white p-2 pr-12 text-md shadow-sm hover:bg-slate-100"
        placeholder="Search procedure or alias..."
        value={search}
        onFocus={() => setIsSearchFocused(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedProcedure(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setIsSearchFocused(false);
          }

          if (e.key === "Escape") {
            e.preventDefault();
            setSearch("");
            setSelectedProcedure(null);
            setIsSearchFocused(false);
          }
        }}
        onBlur={() => {
          setTimeout(() => setIsSearchFocused(false), 150);
        }}
      />

      {search && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setSelectedProcedure(null);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>
      )}

      {isSearchFocused && search.trim() && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-auto w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {suggestions.map((procedure) => {
            const matchingAlias = getMatchingAlias(procedure);

            return (
              <button
                key={procedure.id}
                type="button"
                onMouseDown={() => {
                  setSearch(procedure.name);
                  setSelectedProcedure(procedure);
                  setIsSearchFocused(false);
                }}
                className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-green-100"
              >
                <div className="font-medium text-slate-900">
                  {procedure.name}
                </div>

                {matchingAlias && (
                  <div className="mt-1 text-xs text-slate-500">
                    Alias: {matchingAlias.aliasName}
                  </div>
                )}

                {procedure.bodyPart && (
                  <div className="mt-1 text-xs text-slate-400">
                    {procedure.bodyPart}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
