import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
import ClinicChip from "./ClinicChip";

type ProcedureDetailsProps = {
  selectedProcedure: any;
  setSelectedProcedure: (procedure: any) => void;
  getClinicProcedureRadiologists: (clinic: any, procedure: any) => any[];
};

export default function ProcedureDetails({
  selectedProcedure,
  setSelectedProcedure,
  getClinicProcedureRadiologists,
}: ProcedureDetailsProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{selectedProcedure.name}</h2>

            {selectedProcedure.displayName && (
              <p className="mt-1 text-sm text-slate-500">
                Source: {selectedProcedure.displayName}
              </p>
            )}

            {selectedProcedure.aliases?.length > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                Aliases:{" "}
                {selectedProcedure.aliases
                  .map((a: { aliasName: string }) => a.aliasName)
                  .join(", ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSelectedProcedure(null)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
          >
            ← Back
          </button>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[1fr_280px]">
          <div className="w-full overflow-x-auto">
            <section className="min-w-190 border border-slate-200">
              <div className="grid grid-cols-[200px_1fr_1fr] border-b border-slate-200 bg-slate-200 px-4 py-2 text-sm font-semibold">
                <div>Clinic</div>
                <div>Modality: Booking Categories</div>
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
                      (category: { clinic: any }) =>
                        category.clinic === clinic.clinic,
                    );
                  const matchingRadiologists = getClinicProcedureRadiologists(
                    clinic,
                    selectedProcedure,
                  );

                  return (
                    <div
                      key={`${selectedProcedure.id}-${clinic.clinic}-${index}`}
                      className="grid grid-cols-[200px_1fr_1fr] border-b bg-white px-4 py-2 text-sm last:border-b-0"
                    >
                      <div>
                        <ClinicChip
                          label={clinic.clinic}
                          clinicName={clinic.clinic}
                          city={clinic.city}
                          radiologists={matchingRadiologists}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {categoriesForClinic.length > 0 ? (
                          categoriesForClinic.map(
                            (
                              category: {
                                modalityName: string | null;
                                bookingCategoryColor: any;
                                name:
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | ReactPortal
                                  | Promise<
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | ReactPortal
                                      | ReactElement<
                                          unknown,
                                          string | JSXElementConstructor<any>
                                        >
                                      | Iterable<ReactNode>
                                      | null
                                      | undefined
                                    >
                                  | null
                                  | undefined;
                                isPrimary: any;
                              },
                              categoryIndex: Key | null | undefined,
                            ) => (
                              <div
                                key={categoryIndex}
                                className="flex items-center gap-1"
                              >
                                {category.modalityName && (
                                  <span className="text-xs font-semibold text-slate-500">
                                    {category.modalityName}:
                                  </span>
                                )}
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
                              </div>
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
                  .sort((a: { name: string }, b: { name: any }) =>
                    a.name.localeCompare(b.name),
                  )
                  .map(
                    (
                      r: {
                        genderColor: any;
                        name:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        notes:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      },
                      index: Key | null | undefined,
                    ) => (
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
                    ),
                  )
              ) : (
                <p className="p-3 text-slate-400">No radiologists mapped</p>
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
  );
}
