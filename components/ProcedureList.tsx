import ProcedureCard from "./ProcedureCard";

type ProcedureListProps = {
  sortedProcedures: any[];
  filteredLength: number;
  onSelectProcedure: (procedure: any) => void;
  getClinicProcedureRadiologists: (clinic: any, procedure: any) => any[];
};

export default function ProcedureList({
  sortedProcedures,
  filteredLength,
  onSelectProcedure,
  getClinicProcedureRadiologists,
}: ProcedureListProps) {
  return (
    <div className="space-y-3">
      {sortedProcedures.map((procedure) => (
        <ProcedureCard
          key={procedure.id}
          procedure={procedure}
          onSelect={onSelectProcedure}
          getClinicProcedureRadiologists={getClinicProcedureRadiologists}
        />
      ))}

      {filteredLength === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No procedures found.
        </div>
      )}
    </div>
  );
}