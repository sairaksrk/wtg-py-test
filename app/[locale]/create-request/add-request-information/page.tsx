import Hydrate from "@/components/common/hydrate";
import ManpowerRequestForm from "@/components/features/rp-01/manpowerRequestForm/manpower-request-form";

export default function AddRequestPage() {
  return (
    <Hydrate state={null}>
      <ManpowerRequestForm />
    </Hydrate>
  );
}
