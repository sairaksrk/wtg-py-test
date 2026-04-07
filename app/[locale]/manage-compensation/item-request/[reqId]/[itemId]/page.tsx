import Hydrate from "@/components/common/hydrate";
import CompensationRequestDetail from "@/components/features/compensation/compensationManagement/compensation-request-detail";
interface ManpowerRequestManagePageProps {
  params: Promise<{ itemId: any; locale: string }>;
}

export default async function CompensationRequestDetailPage({
  params,
}: ManpowerRequestManagePageProps) {
  const { itemId } = await params;
  //   const client = queryClient();

  // await client.prefetchQuery({
  //   queryKey: manpowerKeys.list(),
  //   queryFn: () => getManpowerRequestsList(),
  // });

  return (
    // <Hydrate state={dehydrate(client)}>
    <Hydrate state={null}>
      <CompensationRequestDetail itemId={itemId} />
    </Hydrate>
  );
}
