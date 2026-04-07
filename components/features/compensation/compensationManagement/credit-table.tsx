import { DataTable } from "@/components/common/data-table";
import { useCreditColumns } from "./use-credit-columns";
import { ManpowerRequestList } from "@/types/manpower";


interface CompensationTableProps {
  data: ManpowerRequestList[];
  totalRows: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage?: number;
  onEdit?: (id: any) => void;
  onDelete?: (id: string) => void;
}

export function CreditTable({
  data,
  totalRows,
  currentPage,
  onPageChange,
  rowsPerPage = 10,
  onEdit,
  onDelete,
}: CompensationTableProps) {
  const columns = useCreditColumns({ onEdit, onDelete });

  return (
    <DataTable
      data={data}
      columns={columns}
      rowsPerPage={rowsPerPage}
      totalRows={totalRows}
      currentPage={currentPage}
      setPage={(page) => {
        onPageChange(Number(page));
      }}
    />
  );
}
