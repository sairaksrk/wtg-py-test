import Hydrate from "@/components/common/hydrate";
import { dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/libs/query/client";
import { manpowerKeys } from "@/libs/query/manpower.queries";
import { getManpowerRequestsList } from "@/libs/api/manpower.api";
import ManpowerRequestList from "@/components/features/rp-01/manpowerRequestTable/manpower-request-list";

/**
 * Server Component - RP-01 Table ManPower Information Page
 */

export default async function ManPowerPage() {
  const client = queryClient();

  await client.prefetchQuery({
    queryKey: manpowerKeys.list(),
    queryFn: () => getManpowerRequestsList(),
  });

  return (
    <Hydrate state={dehydrate(client)}>
      <ManpowerRequestList />
    </Hydrate>
  );
}
