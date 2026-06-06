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
};

export default function ClinicChip({
  label,
  clinicName,
  city,
  radiologists,
  variant = "chip",
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

  const tooltip = `${clinicName}\n${
    radiologists.length
      ? radiologists.map((rad) => rad.name).join("\n")
      : "No radiologists listed for this procedure at this clinic yet"
  }`;

  if (variant === "text") {
    return (
      <span title={tooltip} className="rounded px-1 hover:text-green-700">
        {label}
      </span>
    );
  }

  return (
    <span
      title={tooltip}
      className={`${getClinicChipClass(
        city,
      )} rounded-full px-2 py-1 text-xs font-medium hover:brightness-95`}
    >
      {label}
    </span>
  );
}
