import Hydrate from "@/components/common/hydrate";
import CompensationRequestDetail from "@/components/features/compensation/compensationManagement/compensation-request-detail";
interface ManpowerRequestManagePageProps {
  params: Promise<{ reqId: string; itemId: string; locale: string }>;
}

export default async function CompensationRequestDetailPage({
  params,
}: ManpowerRequestManagePageProps) {
  const { reqId, itemId } = await params;

  //   const client = queryClient();

  // await client.prefetchQuery({
  //   queryKey: manpowerKeys.list(),
  //   queryFn: () => getManpowerRequestsList(),
  // });

  return (
    // <Hydrate state={dehydrate(client)}>
    <Hydrate state={null}>
      <CompensationRequestDetail reqId={reqId} itemId={itemId} />
    </Hydrate>
  );
}
