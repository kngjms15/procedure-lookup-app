"use client";

import { useEffect, useMemo, useState } from "react";

type ClinicItem = {
  clinic: string;
  city: string | null;
  modality: string | null;
  notes: string | null;
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="sticky top-0 z-30 -mx-8 mb-2 border-b border-slate-200 bg-slate-50 px-8 pb-4 pt-4 backdrop-blur">
          <h1 className="mb-2 text-3xl font-bold">Procedure Library</h1>

          <p className="mb-2 text-slate-600">
            Search procedures and view available clinics, booking categories,
            and radiologists.
          </p>

          <div className="relative">
            <input
              className="w-full rounded-lg border border-slate-300 bg-white p-2 pr-12 text-md shadow-sm hover:bg-slate-100"
              placeholder="Search procedure or alias..."
              value={search}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedProcedure(null);
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

            {isSearchFocused && suggestions.length > 0 && (
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
        </div>

        <div className="mb-2 text-sm text-slate-500">
          Showing {filtered.length} of {procedures.length} procedures
        </div>

        {selectedProcedure ? (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setSelectedProcedure(null)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
            >
              ← Back to results
            </button>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">Procedure Name: {selectedProcedure.name}</h2>

                {selectedProcedure.displayName && (
                  <p className="mt-1 text-sm text-slate-500">
                    Source: {selectedProcedure.displayName}
                  </p>
                )}

                {selectedProcedure.aliases?.length > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    Aliases:{" "}
                    {selectedProcedure.aliases
                      .map((a) => a.aliasName)
                      .join(", ")}
                  </p>
                )}
              </div>

              <div className="grid items-start gap-4 lg:grid-cols-[1fr_280px]">
                <div className="w-full overflow-x-auto">
                  <section className="min-w-190 border border-slate-200">
                    <div className="grid grid-cols-[200px_1fr_1fr] border-b border-slate-200 bg-slate-200 px-4 py-2 text-sm font-semibold">
                      <div>Clinic</div>
                      <div>Booking Categories</div>
                      <div>Protocol / Clinic Notes</div>
                    </div>

                    {[...selectedProcedure.clinics]
                      .sort((a, b) => {
                        const cityCompare = (a.city ?? "").localeCompare(
                          b.city ?? "",
                        );

                        if (cityCompare !== 0) return cityCompare;

                        return a.clinic.localeCompare(b.clinic);
                      })
                      .map((clinic, index) => {
                        const categoriesForClinic =
                          selectedProcedure.bookingCategories.filter(
                            (category) => category.clinic === clinic.clinic,
                          );

                        return (
                          <div
                            key={`${selectedProcedure.id}-${clinic.clinic}-${index}`}
                            className="grid grid-cols-[200px_1fr_1fr] border-b bg-white px-4 py-2 text-sm last:border-b-0"
                          >
                            <div>
                              <span
                                className={`${getClinicChipClass(
                                  clinic.city,
                                )} rounded-full px-2 py-1 text-xs font-medium`}
                              >
                                {clinic.clinic}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {categoriesForClinic.length > 0 ? (
                                categoriesForClinic.map(
                                  (category, categoryIndex) => (
                                    <span
                                      key={categoryIndex}
                                      className="border px-2 py-1 text-xs font-medium"
                                      style={{
                                        backgroundColor:
                                          category.bookingCategoryColor ||
                                          "#e2e8f0",
                                        borderColor:
                                          category.bookingCategoryColor ||
                                          "#cbd5e1",
                                        color: "#1e293b",
                                      }}
                                    >
                                      {category.name}
                                      {category.isPrimary ? " ⭐" : ""}
                                    </span>
                                  ),
                                )
                              ) : (
                                <span className="text-slate-400">
                                  No category mapped
                                </span>
                              )}
                            </div>

                            <div className="text-slate-600">
                              {clinic.notes || "—"}
                            </div>
                          </div>
                        );
                      })}
                  </section>
                </div>

                <section className="border border-slate-200">
                  <h3 className="border-b border-slate-200 bg-slate-200 px-4 py-2 text-sm font-semibold">
                    Radiologists
                  </h3>

                  <div className="space-y-1 p-2 text-sm text-slate-700">
                    {selectedProcedure.radiologists.length > 0 ? (
                      selectedProcedure.radiologists
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((r, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-b-gray-200 border-l-[3px] py-1 pl-2"
                            style={{
                              borderLeftColor: r.genderColor || "#cbd5e1",
                            }}
                          >
                            <span className="font-medium">{r.name}</span>

                            {r.notes && (
                              <span className="ml-2 text-xs italic text-slate-500">
                                {r.notes}
                              </span>
                            )}
                          </div>
                        ))
                    ) : (
                      <p className="p-3 text-slate-400">
                        No radiologists mapped
                      </p>
                    )}
                  </div>
                </section>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">Global Rules</h3>

                <p className="mt-1 text-sm text-slate-600">
                  {selectedProcedure.internalNotes
                    ? `Booked By: ${selectedProcedure.internalNotes}`
                    : "No global rules added yet."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((procedure) => (
              <button
                key={procedure.id}
                type="button"
                onClick={() => setSelectedProcedure(procedure)}
                className="block w-full rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm hover:bg-green-100"
              >
                <h2 className="text-xl font-semibold">{procedure.name}</h2>

                {procedure.displayName && (
                  <p className="mt-1 text-sm text-slate-500">
                    Source: {procedure.displayName}
                  </p>
                )}

                {procedure.aliases?.length > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    Aliases:{" "}
                    {procedure.aliases.map((a) => a.aliasName).join(", ")}
                  </p>
                )}
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                No procedures found.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
