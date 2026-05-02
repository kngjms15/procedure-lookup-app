"use client";

import { useEffect, useState } from "react";

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
};

type RadiologistItem = {
  name: string;
  status: string | null;
};

type Procedure = {
  id: string;
  name: string;
  displayName: string | null;
  clinics: ClinicItem[];
  bookingCategories: BookingCategoryItem[];
  radiologists: RadiologistItem[];
};

export default function Home() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRadiologist, setSelectedRadiologist] = useState("");
  const [expandedProcedureId, setExpandedProcedureId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadProcedures() {
      const res = await fetch("/api/procedures");
      const data = await res.json();
      setProcedures(data);
    }

    loadProcedures();
  }, []);

  const filtered = procedures.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchesClinic = selectedClinic
      ? p.clinics.some((c) => c.clinic === selectedClinic)
      : true;

    const matchesCategory = selectedCategory
      ? p.bookingCategories.some((b) => b.name === selectedCategory)
      : true;

    const matchesRadiologist = selectedRadiologist
      ? p.radiologists.some((r) => r.name === selectedRadiologist)
      : true;

    return (
      matchesSearch && matchesClinic && matchesCategory && matchesRadiologist
    );
  });

  function getClinicChipClass(city: string | null) {
    if (!city) {
      return "bg-gray-100 text-gray-700 border border-gray-200";
    }

    if (city.toLowerCase() === "calgary") {
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    }

    if (city.toLowerCase() === "edmonton") {
      return "bg-blue-100 text-blue-800 border border-blue-200";
    }

    return "bg-gray-100 text-gray-700 border border-gray-200";
  }

  const allClinics = Array.from(
    new Set(procedures.flatMap((p) => p.clinics.map((c) => c.clinic))),
  );

  const allCategories = Array.from(
    new Set(procedures.flatMap((p) => p.bookingCategories.map((b) => b.name))),
  );

  const allRadiologists = Array.from(
    new Set(procedures.flatMap((p) => p.radiologists.map((r) => r.name))),
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold">Procedure Library</h1>

        <p className="mb-6 text-slate-600">
          Search procedures and view clinics, booking categories, and
          radiologist availability.
        </p>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Clinics</option>
            {allClinics.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedRadiologist}
            onChange={(e) => setSelectedRadiologist(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Radiologists</option>
            {allRadiologists.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <input
          className="mb-6 w-full rounded-xl border border-slate-300 bg-white p-4 text-lg shadow-sm"
          placeholder="Search procedure..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-5">
          {filtered.map((procedure) => (
            <div
              key={procedure.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{procedure.name}</h2>
                  {procedure.displayName && (
                    <p className="mt-1 text-sm text-slate-500">
                      Source: {procedure.displayName}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    setExpandedProcedureId(
                      expandedProcedureId === procedure.id
                        ? null
                        : procedure.id,
                    )
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {expandedProcedureId === procedure.id ? "▲" : "▼"}
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="w-full overflow-x-auto">
                  <section className="min-w-[760px] overflow-hidden rounded-xl border border-slate-200">
                    <div className="grid grid-cols-[200px_1fr_1fr] border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold">
                      <div>Clinic</div>
                      <div>Booking Categories</div>
                      <div>Protocol / Notes</div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {procedure.clinics.map((clinic, index) => {
                        const categoriesForClinic =
                          procedure.bookingCategories.filter(
                            (category) => category.clinic === clinic.clinic,
                          );

                        return (
                          <div
                            key={index}
                            className="sticky top-0 z-10 grid grid-cols-[200px_1fr_1fr] border-b bg-slate-50 px-4 py-2 text-sm font-semibold"
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
                                      className={`border px-2 py-1 text-xs font-medium ${
                                        category.isPrimary
                                          ? "border-yellow-200 bg-[#0af410] text-yellow-800"
                                          : "border-slate-200 bg-[#a27dfa] text-slate-800"
                                      }`}
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
                    </div>
                  </section>
                </div>

                <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-800">
                    Radiologists
                  </h3>
                  <div className="space-y-1 text-sm text-slate-700">
                    {procedure.radiologists.length > 0 ? (
                      procedure.radiologists.map((r, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{r.name}</span>

                          {r.status && (
                            <span
                              className={`text-xs font-medium ${
                                r.status.toLowerCase() === "yes"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              ● {r.status}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">No radiologists mapped</p>
                    )}
                  </div>
                </section>
              </div>

              {expandedProcedureId === procedure.id && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">Global Rules</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {procedure.displayName
                      ? `Source: ${procedure.displayName}`
                      : "No global rules added yet."}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
