"use client";

import { useEffect, useState } from "react";

type Procedure = {
  name: string;
  modality: string;
  clinics: string[];
  bookingCategories: string[];
  notes: string;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [procedures, setProcedures] = useState<Procedure[]>([]);

  // 🔥 fetch from API
  useEffect(() => {
    const fetchProcedures = async () => {
      const res = await fetch("/api/procedures");
      const data = await res.json();
      setProcedures(data);
    };

    fetchProcedures();
  }, []);

  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedModality, setSelectedModality] = useState("");

  const filtered = procedures.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchesClinic = selectedClinic
      ? p.clinics.includes(selectedClinic)
      : true;

    const matchesModality = selectedModality
      ? p.modality === selectedModality
      : true;

    return matchesSearch && matchesClinic && matchesModality;
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Procedure Lookup
        </h1>

        <div className="flex gap-4 mb-4">
          <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="p-2 border rounded text-gray-500"
          >
            <option value="">All Clinics</option>
            <option value="BW">BW</option>
            <option value="MB">MB</option>
            <option value="CH">CH</option>
          </select>

          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="p-2 border rounded text-gray-500"
          >
            <option value="">All Modalities</option>
            <option value="PMI">PMI</option>
            <option value="Fluoro">Fluoro</option>
          </select>
        </div>

        <input
          className="mb-6 w-full rounded-xl border border-slate-300 bg-white p-4 text-lg shadow-sm text-gray-500"
          placeholder="Search procedure... example: hip"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filtered.map((procedure) => (
            <div
              key={procedure.name}
              className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {procedure.name}
              </h2>

              <p className="mt-2 text-slate-700">
                <strong>Modality:</strong> {procedure.modality}
              </p>

              <p className="mt-2 text-slate-700">
                <strong>Clinics:</strong> {procedure.clinics.join(", ")}
              </p>

              <p className="mt-2 text-slate-700">
                <strong>Booking Categories:</strong>{" "}
                {procedure.bookingCategories.join(", ")}
              </p>

              <p className="mt-2 text-slate-700">
                <strong>Notes:</strong> {procedure.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
