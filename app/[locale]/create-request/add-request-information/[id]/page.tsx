import Hydrate from "@/components/common/hydrate";
import ManpowerRequestForm from "@/components/features/rp-01/manpowerRequestForm/manpower-request-form";
import { getManpowerRequestsById } from "@/libs/api/manpower.api";

import { queryClient } from "@/libs/query/client";
import { manpowerKeys } from "@/libs/query/manpower.queries";
import { dehydrate } from "@tanstack/react-query";
// import { getSystemList } from "@/libs/api/system.api"

interface ManpowerRequestManagePageProps {
  params: Promise<{ id: any; locale: string }>;
}

export default async function EditRequestPage({
  params,
}: ManpowerRequestManagePageProps) {
  const { id } = await params;
  const client = queryClient();

  // await client.prefetchQuery({
  //   queryKey: systemKeys.lists(),
  //   queryFn: () => getSystemList(),
  // });

  await client.prefetchQuery({
    queryKey: manpowerKeys.detail(id),
    queryFn: () => getManpowerRequestsById(id),
  });

  return (
    <Hydrate state={dehydrate(client)}>
      <ManpowerRequestForm reqId={id} />
    </Hydrate>
  );
}
