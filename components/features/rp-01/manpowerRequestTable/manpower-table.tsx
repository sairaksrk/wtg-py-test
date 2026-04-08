import { DataTable } from "@/components/common/data-table";
import { useManpowerColumns } from "./use-manpower-columns";
import { ManpowerRequestList } from "@/types/compensation";

interface ManPowerTableProps {
  data: ManpowerRequestList[];
  totalRows: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ManPowerTable({
  data,
  totalRows,
  currentPage,
  onPageChange,
  rowsPerPage = 10,
  onEdit,
  onDelete,
}: ManPowerTableProps) {
  const columns = useManpowerColumns({ onEdit, onDelete });

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
