"use client";

import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import SearchBar from "../components/SearchBar";
import ClinicChip from "../components/ClinicChip";
import ProcedureCard from "../components/ProcedureCard";
import ProcedureDetails from "../components/ProcedureDetails";
import ProcedureList from "../components/ProcedureList";

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

type AliasItem = {
  aliasName: string;
  aliasType: string | null;
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

export default function Home() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProcedures() {
      const res = await fetch("/api/procedures");

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error:", res.status, errorText);
        return;
      }

      const data = await res.json();
      setProcedures(data);
    }

    loadProcedures();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProcedure) {
        setSelectedProcedure(null);
        setIsSearchFocused(false);
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProcedure]);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return procedures.filter((p) => {
      const searchableContent = [
        p.name,
        p.displayName || "",
        p.bodyPart || "",
        p.procedureType || "",
        ...(p.aliases ?? []).map((a) => a.aliasName),
        ...p.clinics.map((c) => c.clinic),
        ...p.bookingCategories.map((b) => b.name),
        ...p.radiologists.map((r) => r.name),
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });
  }, [procedures, normalizedSearch]);

  const suggestions = useMemo(() => {
    if (!normalizedSearch) return [];

    return procedures
      .filter((p) => {
        const procedureFields = [
          p.name,
          p.displayName || "",
          p.bodyPart || "",
          p.procedureType || "",
        ]
          .join(" ")
          .toLowerCase();

        const aliasMatch = (p.aliases ?? []).some((a) =>
          a.aliasName.toLowerCase().includes(normalizedSearch),
        );

        return procedureFields.includes(normalizedSearch) || aliasMatch;
      })
      .slice(0, 8);
  }, [procedures, normalizedSearch]);

  const sortedProcedures = [...filtered].sort((a, b) => {
    const aStartsWithNumber = /^\d/.test(a.name);
    const bStartsWithNumber = /^\d/.test(b.name);

    // Numbers first
    if (aStartsWithNumber && !bStartsWithNumber) return -1;
    if (!aStartsWithNumber && bStartsWithNumber) return 1;

    // Then alphabetical
    return a.name.localeCompare(b.name);
  });

  const getClinicProcedureRadiologists = (clinic: any, procedure: any) => {
    const procedureRadNames =
      procedure.radiologists?.map((rad: { name: string }) => rad.name) ?? [];

    return (
      clinic.radiologists?.filter((rad: { name: string }) =>
        procedureRadNames.includes(rad.name),
      ) ?? []
    );
  };

  function getClinicChipClass(city: string | null) {
    if (!city) return "bg-gray-100 text-gray-700 border border-gray-200";

    if (city.toLowerCase() === "calgary") {
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    }

    if (city.toLowerCase() === "edmonton") {
      return "bg-blue-100 text-blue-800 border border-blue-200";
    }

    return "bg-gray-100 text-gray-700 border border-gray-200";
  }

  function getMatchingAlias(procedure: Procedure) {
    return procedure.aliases?.find((a) =>
      a.aliasName.toLowerCase().includes(normalizedSearch),
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="sticky top-0 z-30 mb-2 border-b border-slate-200 bg-white px-8 pb-4 pt-4 backdrop-blur-none">
          <h1 className="mb-1 text-2xl font-bold">Procedure Library</h1>

          <p className="mb-2 text-slate-700">
            Search procedures and view available clinics, booking categories,
            and radiologists.
          </p>

          <SearchBar
            search={search}
            setSearch={setSearch}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            suggestions={suggestions}
            setSelectedProcedure={setSelectedProcedure}
            getMatchingAlias={getMatchingAlias}
            inputRef={inputRef}
          />
        </div>

        <div className="mb-2 text-sm text-slate-500">
          Showing {filtered.length} of {procedures.length} procedures
        </div>

        {selectedProcedure ? (
          <ProcedureDetails
            selectedProcedure={selectedProcedure}
            setSelectedProcedure={setSelectedProcedure}
            getClinicProcedureRadiologists={getClinicProcedureRadiologists}
          />
        ) : (
          <ProcedureList
            sortedProcedures={sortedProcedures}
            filteredLength={filtered.length}
            onSelectProcedure={setSelectedProcedure}
            getClinicProcedureRadiologists={getClinicProcedureRadiologists}
          />
        )}
      </div>
    </main>
  );
}
