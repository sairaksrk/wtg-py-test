import Hydrate from "@/components/common/hydrate";
import CompensationRequestForm from "@/components/features/compensation/compensationManagement/compensation-request-form";
import {
  getCompensationRequestById,
  getGroupsListCheckBox,
} from "@/libs/api/compensation.api";
import { compensationKeys } from "@/libs/query/compensation.queries";
import { queryClient } from "@/libs/query/client";
import { dehydrate } from "@tanstack/react-query";
import {
  getPositionTypeLevelList,
  getReviewerList,
  getStructureUnitList,
} from "@/libs/api/master.api";
import { masterKeys, useGetPermissions } from "@/libs/query/master.queries";

interface CompensationRequestPageProps {
  params: Promise<{ reqId: any; locale: string }>;
}

export default async function CompensationRequestPage({
  params,
}: CompensationRequestPageProps) {
  const { reqId } = await params;
  const client = queryClient();
  const defaultParams = {
    page: 1,
    take: 10,
  };

  await Promise.all([
    client.prefetchQuery({
      queryKey: compensationKeys.requestDetail(reqId, defaultParams),
      queryFn: () => getCompensationRequestById(reqId, defaultParams),
    }),
    client.prefetchQuery({
      queryKey: masterKeys.positionTypeLevels(),
      queryFn: () => getPositionTypeLevelList(),
    }),
    client.prefetchQuery({
      queryKey: masterKeys.agencies(),
      queryFn: () => getStructureUnitList(),
    }),
    client.prefetchQuery({
      queryKey: masterKeys.reviewer(),
      queryFn: () => getReviewerList(),
    }),
    client.prefetchQuery({
      queryKey: compensationKeys.groupsListCheckBox(reqId),
      queryFn: () => getGroupsListCheckBox(reqId),
    }),
    client.prefetchQuery({
      queryKey: masterKeys.permissions(),
      queryFn: () => useGetPermissions(),
    }),
  ]);

  return (
    <Hydrate state={dehydrate(client)}>
      <CompensationRequestForm reqId={reqId} />
    </Hydrate>
  );
}