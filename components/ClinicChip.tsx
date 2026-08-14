type RadiologistItem = {
  name: string;
  status: string | null;
  notes: string | null;
  genderColor: string | null;
};

type ClinicChipProps = {
  label: string;
  clinicName: string;
  city: string | null;
  radiologists: RadiologistItem[];
  variant?: "chip" | "text";
  tooltipPosition?: "top" | "bottom";
};

export default function ClinicChip({
  label,
  clinicName,
  city,
  radiologists,
  variant = "chip",
  tooltipPosition = "top",
}: ClinicChipProps) {
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

  const tooltipPositionClass =
    tooltipPosition === "bottom"
      ? "top-full left-0 mt-2"
      : "bottom-full left-0 mb-2";

  const tooltip = (
    <div
      className={`pointer-events-none absolute z-50 hidden min-w-max rounded bg-slate-800 px-2 py-1 text-xs text-white shadow-lg group-hover/clinic:block ${tooltipPositionClass}`}
    >
      <div className="mb-1 whitespace-nowrap font-semibold">{clinicName}</div>

      {radiologists.length > 0 ? (
        radiologists.map((rad) => (
          <div key={rad.name} className="whitespace-nowrap">
            {rad.name}
          </div>
        ))
      ) : (
        <div className="max-w-56 whitespace-normal text-slate-200">
          No radiologists listed for this procedure at this clinic yet
        </div>
      )}
    </div>
  );

  if (variant === "text") {
    return (
      <span className="group/clinic relative inline-block">
        <span className="rounded px-1 hover:text-green-700">{label}</span>

        {tooltip}
      </span>
    );
  }

  return (
    <span className="group/clinic relative inline-block">
      <span
        className={`${getClinicChipClass(
          city,
        )} inline-block rounded-full px-2 py-1 text-xs font-medium hover:brightness-95`}
      >
        {label}
      </span>

      {tooltip}
    </span>
  );
}
