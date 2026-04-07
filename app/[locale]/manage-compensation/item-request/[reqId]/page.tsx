import Hydrate from "@/components/common/hydrate";
import CompensationRequestForm from "@/components/features/compensation/compensationManagement/compensation-request-form";
import { queryClient } from "@/libs/query/client";

interface ManpowerRequestManagePageProps {
  params: Promise<{ reqId: any; locale: string }>;
}

export default async function CompensationRequestPage({
  params,
}: ManpowerRequestManagePageProps) {
  const { reqId } = await params;
  //   const client = queryClient();

  // await client.prefetchQuery({
  //   queryKey: manpowerKeys.list(),
  //   queryFn: () => getManpowerRequestsList(),
  // });

  return (
    // <Hydrate state={dehydrate(client)}>
    <Hydrate state={null}>
      <CompensationRequestForm reqId={reqId} />
    </Hydrate>
  );
}
