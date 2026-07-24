type BillingCode = {
  billingCodeId: string | null;
  internalFeeCode: string | null;
  serviceName: string | null;
  modalityName: string | null;
  notes: string | null;
};

type BillingCodeSectionProps = {
  billingCodes?: BillingCode[];
};

const BillingCodeSection = ({ billingCodes = [] }: BillingCodeSectionProps) => {
  if (billingCodes.length === 0) {
    return null;
  }

  const groupedBillingCodes = billingCodes.reduce<
    Record<string, BillingCode[]>
  >((groups, billingCode) => {
    const modality = billingCode.modalityName || "Other";

    if (!groups[modality]) {
      groups[modality] = [];
    }

    groups[modality].push(billingCode);

    return groups;
  }, {});

  const modalityOrder = ["FL", "US"];

  const sortedGroups = Object.entries(groupedBillingCodes).sort(
    ([modalityA], [modalityB]) => {
      const indexA = modalityOrder.indexOf(modalityA);
      const indexB = modalityOrder.indexOf(modalityB);

      if (indexA === -1 && indexB === -1) {
        return modalityA.localeCompare(modalityB);
      }

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    },
  );

  return (
    <section className="mb-1">
      <h3 className="mb-1 text-sm font-semibold text-slate-800">
        BILLING CODES
      </h3>

      <div className="space-y-1">
        {sortedGroups.map(([modality, codes]) => (
          <div
            key={modality}
            className="grid grid-cols-[32px_1fr] items-start gap-x-1"
          >
            <div className="pt-0.5 text-xs font-semibold text-slate-500">
              {modality}:
            </div>

            <div className="space-y-1">
              {codes.map((code, index) => {
                const primaryText =
                  code.internalFeeCode || code.serviceName || "No code listed";

                const showServiceName =
                  code.internalFeeCode &&
                  code.serviceName &&
                  code.internalFeeCode.trim().toLowerCase() !==
                    code.serviceName.trim().toLowerCase();

                return (
                  <div
                    key={
                      code.billingCodeId ??
                      `${modality}-${primaryText}-${index}`
                    }
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="font-semibold text-slate-700">
                        {primaryText}
                      </span>

                      {showServiceName && (
                        <>
                          <span className="text-slate-400">—</span>

                          <span className="text-slate-700">
                            {code.serviceName}
                          </span>
                        </>
                      )}

                      {code.notes && (
                        <>
                          <span className="text-slate-500">•</span>

                          <span className="text-xs italic text-slate-500">
                            {code.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BillingCodeSection;
