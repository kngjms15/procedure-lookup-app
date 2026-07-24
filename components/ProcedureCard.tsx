import BillingCodeSection from "./BillingCodeSection";
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
      className="group w-full rounded-md border border-slate-500 bg-white p-5 text-left shadow-sm transition-colors hover:bg-green-50"
    >
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-6">
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

        <div className="w-full text-sm text-slate-500 md:w-130 md:shrink-0">
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
                      const matchingRadiologists =
                        getClinicProcedureRadiologists(clinic, procedure);

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
      </div>

      {procedure.billingCodes?.length > 0 && (
        <div
          className="
      grid
      grid-rows-[0fr]
      opacity-0
      transition-all
      duration-300
      ease-out
      group-hover:mt-4
      group-hover:grid-rows-[1fr]
      group-hover:opacity-100
      group-focus-visible:mt-4
      group-focus-visible:grid-rows-[1fr]
      group-focus-visible:opacity-100
    "
        >
          <div className="overflow-hidden">
            <div className="border-t border-slate-200 pt-3">
              <BillingCodeSection billingCodes={procedure.billingCodes} />
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
