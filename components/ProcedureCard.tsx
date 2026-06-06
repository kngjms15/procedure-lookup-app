import ClinicChip from "./ClinicChip";

type ProcedureCardProps = {
  procedure: any;
  onSelect: (procedure: any) => void;
  getClinicProcedureRadiologists: (clinic: any, procedure: any) => any[];
};

export default function ProcedureCard({
  procedure,
  onSelect,
  getClinicProcedureRadiologists,
}: ProcedureCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(procedure)}
      className="flex w-full items-start justify-between gap-6 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm hover:bg-green-100"
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-semibold">{procedure.name}</h2>

        {procedure.displayName && (
          <p className="mt-1 text-sm text-slate-500">
            Source: {procedure.displayName}
          </p>
        )}

        {procedure.aliases?.length > 0 && (
          <p className="mt-1 text-xs text-slate-400">
            Aliases:{" "}
            {procedure.aliases
              .map((a: { aliasName: string }) => a.aliasName)
              .join(", ")}
          </p>
        )}
      </div>

      <div className="mt-auto w-full text-sm text-slate-500 md:w-130 md:shrink-0">
        {["Calgary", "Edmonton"].map((city) => {
          const cityClinics = procedure.clinics?.filter(
            (clinic: { city: string | null }) => clinic.city === city,
          );

          if (!cityClinics || cityClinics.length === 0) return null;

          return (
            <div key={city} className="mb-1 flex gap-1">
              <span className="font-semibold">
                {city === "Calgary" ? "YYC:" : "YEG:"}
              </span>

              <div className="flex flex-wrap gap-x-1">
                {cityClinics.map(
                  (
                    clinic: {
                      abbreviation: string | null;
                      clinic: string;
                      city: string | null;
                    },
                    index: number,
                  ) => {
                    const matchingRadiologists = getClinicProcedureRadiologists(
                      clinic,
                      procedure,
                    );

                    return (
                      <ClinicChip
                        key={`${clinic.abbreviation}-${index}`}
                        label={`${clinic.abbreviation}${
                          index < cityClinics.length - 1 ? "," : ""
                        }`}
                        clinicName={clinic.clinic}
                        city={clinic.city}
                        radiologists={matchingRadiologists}
                        variant="text"
                      />
                    );
                  },
                )}
              </div>
            </div>
          );
        })}
      </div>
    </button>
  );
}
