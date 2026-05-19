import Hydrate from "@/components/common/hydrate";
import CompensationRequestDetail from "@/components/features/compensation/compensationManagement/compensation-request-detail";
interface CompensationRequestDetailPageProps {
  params: Promise<{ reqId: string; locale: string }>;
}

export default async function CompensationRequestDetailPage({
  params,
}: CompensationRequestDetailPageProps) {
  const { reqId } = await params;

  //   const client = queryClient();

  // await client.prefetchQuery({
  //   queryKey: manpowerKeys.list(),
  //   queryFn: () => getManpowerRequestsList(),
  // });

  return (
    // <Hydrate state={dehydrate(client)}>
    <Hydrate state={null}>
      <CompensationRequestDetail reqId={reqId} />
    </Hydrate>
  );
}
