import { Icon } from "@iconify/react"
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table"
import { uniqueId } from "lodash"

import { useTranslations } from "next-intl"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/utils/helpers"

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	rowsPerPage: number
	currentPage: number
	hiddenColumns?: VisibilityState
	totalRows: number
	setPage: Dispatch<SetStateAction<number>>
	isPaginated?: boolean
	isPermission?: boolean
	onRowSelectionChange?: (rowSelection: any) => void
}

export function DataTable<TData, TValue>({
	columns,
	data,
	rowsPerPage,
	currentPage,
	totalRows,
	hiddenColumns,
	setPage,
	isPaginated = true,
	isPermission = false,
	onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
	const totalPages: number = Math.ceil(totalRows / rowsPerPage)
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(hiddenColumns ?? {})
	const [rowSelection, setRowSelection] = React.useState({})
	const [pageInput, setPageInput] = useState<string>(currentPage.toString())
	const t = useTranslations("common")

	useEffect(() => {
		if (onRowSelectionChange) {
			onRowSelectionChange(rowSelection)
		}
	}, [rowSelection, onRowSelectionChange])

	useEffect(() => {
		setPageInput(currentPage.toString())
	}, [currentPage])

	const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		// Allow only numbers
		if (value === "" || /^\d+$/.test(value)) {
			setPageInput(value)
		}
	}

	const handlePageInputBlur = () => {
		if (pageInput === "") {
			setPageInput(currentPage.toString())
			return
		}

		const pageNumber = Number.parseInt(pageInput, 10)
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setPage(pageNumber)
		}
		else {
			// Reset to current page if invalid
			setPageInput(currentPage.toString())
		}
	}

	const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.currentTarget.blur()
		}
	}

	const table = useReactTable({
		data,
		columns,
		pageCount: totalPages,
		rowCount: rowsPerPage,
		manualPagination: true,
		manualFiltering: true,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getRowId: row => (row as any).id,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize: rowsPerPage,
			},
		},
	})

	return (
		<div className={isPermission ? "overflow-x-auto" : ""}>
			<div className="">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id + uniqueId()} className="border-b-0">
								{headerGroup.headers.map((header) => {
									const permission = isPermission
										? header.id == "permission-tool"
											? "bg-white sticky right-0 whitespace-nowrap"
											: "whitespace-nowrap"
										: ""

									return (
										<TableHead
											className={permission}
											key={header.id + uniqueId()}
											style={{
												minWidth: `${header.column.columnDef.size}%`,
												maxWidth: `${header.column.columnDef.size}%`,
												width: `${header.column.columnDef.size}%`,
											}}
										>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length
							? (
									table.getRowModel().rows.map(row => (
										<TableRow
											key={row.id ? uniqueId() : row.index}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell, colIndex) => {
												return (
													<TableCell
														className={
															cn(
																isPermission
																	? colIndex == columns.length - 1
																		? "sticky right-0 bg-white"
																		: ""
																	: "",
																cell.column.columnDef.meta,
															)
														}
														key={cell.id + uniqueId()}
														style={{
															minWidth: `${cell.column.columnDef.size}%`,
															maxWidth: `${cell.column.columnDef.size}%`,
															width: `${cell.column.columnDef.size}%`,
														}}
													>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												)
											})}
										</TableRow>
									))
								)
							: (
									<TableRow>
										<TableCell colSpan={columns.length} className="h-24 text-center">
											{t("not-found")}
										</TableCell>
									</TableRow>
								)}
					</TableBody>
				</Table>
			</div>
			{table.getRowModel().rows?.length && isPaginated
				? (
						<div className="mt-6 flex flex-wrap items-center justify-end gap-4 p-2 md:justify-between">
							<div className="flex flex-1 items-center gap-2">
								<Button
									variant="secondary"
									size="icon"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										setPage(1)
									}}
									disabled={currentPage === 1}
								>
									<Icon icon="solar:double-alt-arrow-left-outline" />
								</Button>
								<Button
									variant="secondary"
									size="icon"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										setPage(currentPage - 1)
									}}
									disabled={currentPage === 1}
								>
									<Icon icon="solar:alt-arrow-left-outline" />
								</Button>
								<div className="flex items-center gap-2 px-4">
									<Input
										type="text"
										value={pageInput}
										onChange={handlePageInputChange}
										onBlur={handlePageInputBlur}
										onKeyDown={handlePageInputKeyDown}
										className="h-7 w-14 rounded-md text-center text-sm"
									/>
									<span className="text-muted-foreground text-sm whitespace-nowrap">
										{t("pagination.from")}
										{" "}
										{totalPages}
									</span>
								</div>
								<Button
									variant="secondary"
									size="icon"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										setPage(currentPage + 1)
									}}
									disabled={currentPage === totalPages}
								>
									<Icon icon="solar:alt-arrow-right-outline" />
								</Button>
								<Button
									variant="secondary"
									size="icon"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										setPage(totalPages)
									}}
									disabled={currentPage === totalPages}
								>
									<Icon icon="solar:double-alt-arrow-right-outline" />
								</Button>
							</div>
							<div className="text-subdude hidden text-base md:block">
								{t("pagination.show")}
								{" "}
								{(currentPage - 1) * rowsPerPage + 1}
								{" "}
								-
								{" "}
								{Math.min(currentPage * rowsPerPage, totalRows)}
								{" "}
								{t("pagination.from")}
								{" "}
								{totalRows}
								{" "}
								{t("pagination.total")}
							</div>
						</div>
					)
				: (
						<></>
					)}
		</div>
	)
}

