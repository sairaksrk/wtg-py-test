import Hydrate from "@/components/common/hydrate";
import CompensationList from "@/components/features/compensation/compensationList/compensation-list";
import { getCompensationList } from "@/libs/api/compensation.api";
import { dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/libs/query/client";
import { compensationKeys } from "@/libs/query/compensation.queries";

/**
 * Server Component - PY Table Compensation Information Page
 */

export default async function CompensationListPage() {
  const client = queryClient();
  const defaultParams = {
    page: 1,
    take: 10,
  };

  await client.prefetchQuery({
    queryKey: compensationKeys.list(defaultParams),
    queryFn: () => getCompensationList(defaultParams),
  });

  return (
    // <Hydrate state={dehydrate(client)}>
    <Hydrate state={null}>
      <CompensationList />
    </Hydrate>
  );
}
