import { DataTable } from "@/components/common/data-table";
import { useCompensationColumns } from "./use-compensation-columns";
import { CompensationList } from "@/types/compensation";

interface CompensationTableProps {
  data: CompensationList[];
  totalRows: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage?: number;
  onEdit?: (id: any) => void;
  onDelete?: (id: string) => void;
}

export function CompensationTable({
  data,
  totalRows,
  currentPage,
  onPageChange,
  rowsPerPage = 10,
  onEdit,
  onDelete,
}: CompensationTableProps) {
  const columns = useCompensationColumns({ onEdit, onDelete });

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
