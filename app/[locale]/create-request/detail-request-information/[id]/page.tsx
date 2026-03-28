import Hydrate from "@/components/common/hydrate";
import ManpowerDetailForm from "@/components/features/rp-01/manpowerRequestDetail/manpower-detail-form";
import { getManpowerRequestsDetailById } from "@/libs/api/manpower.api";

import { queryClient } from "@/libs/query/client";
import { manpowerKeys } from "@/libs/query/manpower.queries";
import { dehydrate } from "@tanstack/react-query";

interface ManpowerRequestManagePageProps {
  params: Promise<{ id: any; locale: string }>;
}

export default async function DetailRequestPagee({
  params,
}: ManpowerRequestManagePageProps) {
  const { id } = await params;
  const client = queryClient();

  await client.prefetchQuery({
    queryKey: manpowerKeys.detail(id),
    queryFn: () => getManpowerRequestsDetailById(id),
  });

  return (
    <Hydrate state={dehydrate(client)}>
      {/* <Hydrate state={null}> */}
      <ManpowerDetailForm reqId={id} />
    </Hydrate>
  );
}
