import Hydrate from "@/components/common/hydrate";
import CompensationList from "@/components/features/compensation/compensationList/compensation-list";
// import { dehydrate } from "@tanstack/react-query";
// import { queryClient } from "@/libs/query/client";
// import { manpowerKeys } from "@/libs/query/manpower.queries";
// import { getManpowerRequestsList } from "@/libs/api/manpower.api";

/**
 * Server Component - PY Table Compensation Information Page
 */

export default async function CompensationListPage() {
  // const client = queryClient();

  // await client.prefetchQuery({
  //   queryKey: manpowerKeys.list(),
  //   queryFn: () => getManpowerRequestsList(),
  // });

  return (
    // <Hydrate state={dehydrate(client)}>
    <Hydrate state={null}>
      <CompensationList />
    </Hydrate>
  );
}
