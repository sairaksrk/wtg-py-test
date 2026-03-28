"use server" // <--- Runs on Next.js Server

import type { PaginatedResponse } from "@/types/api"
import type { CreateRoleDto, Role, RoleListParams, UpdateRoleDto } from "@/types/role"

// Mock data for development
// TODO: Replace with actual API calls when backend is ready
const mockRoles: Role[] = [
	{
		id: "aca74655-4c04-4b64-81cf-da9b737fd203",
		name: "Admin",
		systems: [
			{
				name: "ระบบจัดการโครงสร้างองค์กร (OR)",
				modules: [
					{ name: "โครงสร้างองค์กร" },
					{ name: "จัดการประเภทและระดับตำแหน่ง" },
					{ name: "จัดการกลุ่มตำแหน่ง" },
					{ name: "จัดการตำแหน่ง" },
					{ name: "จัดการส่วนงานในการบริหารงาน" },
					{ name: "จัดการเบอร์ที่ตำแหน่ง" },
				],
			},
			{
				name: "ระบบจัดสรรอัตรากำลัง (RP)",
				modules: [
					{ name: "จัดการคำขอฯ" },
					{ name: "อัตรากำลัง" },
					{ name: "รายงานอัตรากำลัง" },
				],
			},
			{
				name: "ระบบทะเบียนประวัติบุคลากร (PM)",
				modules: [
					{ name: "ข้อมูลบุคลากร" },
					{ name: "บันทึกการเคลื่อนไหว" },
					{ name: "ค่าแปรรูปฯ" },
					{ name: "คำขอเอกสาร" },
					{ name: "ค่าขอทำบัตรฯ" },
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบจัดการค่าตอบแทน (PY)",
				modules: [
					{ name: "จัดการค่าตอบแทน" },
				],
			},
			{
				name: "ระบบเครื่องราชอิสริยาภรณ์ (RD)",
				modules: [
					{ name: "บัญชีรายชื่อผู้ที่ได้รับพระราชทานฯ" },
					{ name: "การขอพระราชทานฯ" },
					{ name: "ข้อมูลเครื่องราชฯ" },
					{ name: "นำเข้า" },
					{ name: "นำออก" },
					{ name: "รอเบิก" },
					{ name: "รอรับ" },
					{ name: "ยอดคงเหลือฯ" },
					{ name: "คืนเครื่องราชฯ" },
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบบริการตนเอง (ESS)",
				modules: [
					{ name: "ข้อมูลส่วนตัว" },
					{ name: "เอกสาร" },
					{ name: "ฝาก ยืม คืน เครื่องราชฯ" },
				],
			},
			{
				name: "ระบบสำหรับผู้บริหาร (MSS)",
				modules: [
					{ name: "ภาพรวม" },
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบจัดการผู้ใช้งาน (UM)",
				modules: [
					{ name: "จัดการกลุ่มสิทธิ์" },
					{ name: "จัดการผู้ใช้งาน" },
					{ name: "บันทึกการใช้งาน" },
				],
			},
		],
	},
	{
		id: "d6ee599c-a967-419b-97d9-3a4a98ba33f3",
		name: "เจ้าหน้าที่บันทึกข้อมูล",
		systems: [
			{
				name: "ระบบจัดการโครงสร้างองค์กร (OR)",
				modules: [
					{ name: "จัดการกลุ่มตำแหน่ง" },
					{ name: "จัดการตำแหน่ง" },
					{ name: "จัดการตำแหน่งในการบริหารงาน" },
					{ name: "จัดการเบอร์ที่ตำแหน่ง" },
				],
			},
			{
				name: "ระบบจัดสรรอัตรากำลัง (RP)",
				modules: [
					{ name: "จัดการคำขอฯ" },
					{ name: "อัตรากำลัง" },
				],
			},
			{
				name: "ระบบทะเบียนประวัติบุคลากร (PM)",
				modules: [
					{ name: "ข้อมูลบุคลากร" },
					{ name: "บันทึกการเคลื่อนไหว" },
					{ name: "ค่าแปรรูปฯ" },
					{ name: "คำขอเอกสาร" },
					{ name: "ค่าขอทำบัตรฯ" },
				],
			},
			{
				name: "ระบบจัดการค่าตอบแทน (PY)",
				modules: [
					{ name: "จัดการค่าตอบแทน" },
				],
			},
			{
				name: "ระบบเครื่องราชอิสริยาภรณ์ (RD)",
				modules: [
					{ name: "นำเข้า" },
					{ name: "นำออก" },
					{ name: "รอเบิก" },
					{ name: "รอรับ" },
					{ name: "ยอดคงเหลือฯ" },
					{ name: "คืนเครื่องราชฯ" },
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบบริการตนเอง (ESS)",
				modules: [
					{ name: "ข้อมูลส่วนตัว" },
					{ name: "เอกสาร" },
					{ name: "ฝาก ยืม คืน เครื่องราชฯ" },
				],
			},
			{
				name: "ระบบสำหรับผู้บริหาร (MSS)",
				modules: [],
			},
			{
				name: "ระบบจัดการผู้ใช้งาน (UM)",
				modules: [],
			},
		],
	},
	{
		id: "d0182010-28d2-436a-b719-a10987730a18",
		name: "ผู้อำนวยการ",
		systems: [
			{
				name: "ระบบจัดการโครงสร้างองค์กร (OR)",
				modules: [],
			},
			{
				name: "ระบบจัดสรรอัตรากำลัง (RP)",
				modules: [
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบทะเบียนประวัติบุคลากร (PM)",
				modules: [
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบจัดการค่าตอบแทน (PY)",
				modules: [],
			},
			{
				name: "ระบบเครื่องราชอิสริยาภรณ์ (RD)",
				modules: [
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบบริการตนเอง (ESS)",
				modules: [
					{ name: "ข้อมูลส่วนตัว" },
					{ name: "เอกสาร" },
					{ name: "ฝาก ยืม คืน เครื่องราชฯ" },
				],
			},
			{
				name: "ระบบสำหรับผู้บริหาร (MSS)",
				modules: [
					{ name: "ภาพรวม" },
					{ name: "รายงาน" },
				],
			},
			{
				name: "ระบบจัดการผู้ใช้งาน (UM)",
				modules: [],
			},
		],
	},
	{
		id: "692269e2-377a-4414-925c-325587415149",
		name: "บุคลากร",
		systems: [
			{
				name: "ระบบจัดการโครงสร้างองค์กร (OR)",
				modules: [],
			},
			{
				name: "ระบบจัดสรรอัตรากำลัง (RP)",
				modules: [],
			},
			{
				name: "ระบบทะเบียนประวัติบุคลากร (PM)",
				modules: [],
			},
			{
				name: "ระบบจัดการค่าตอบแทน (PY)",
				modules: [],
			},
			{
				name: "ระบบเครื่องราชอิสริยาภรณ์ (RD)",
				modules: [],
			},
			{
				name: "ระบบบริการตนเอง (ESS)",
				modules: [
					{ name: "ข้อมูลส่วนตัว" },
					{ name: "เอกสาร" },
					{ name: "ฝาก ยืม คืน เครื่องราชฯ" },
				],
			},
			{
				name: "ระบบสำหรับผู้บริหาร (MSS)",
				modules: [],
			},
			{
				name: "ระบบจัดการผู้ใช้งาน (UM)",
				modules: [],
			},
		],
	},
]

/**
 * Get paginated list of roles
 */
export async function getRoleList(params?: RoleListParams): Promise<PaginatedResponse<Role>> {
	// TODO: Replace with actual API call
	// const { data } = await axiosInstance.get<PaginatedResponse<Role>>("/roles", { params })
	// return data

	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 100))

	return {
		data: mockRoles,
		meta: {
			page: params?.page ?? 1,
			take: params?.limit ?? 10,
			itemCount: mockRoles.length,
			pageCount: Math.ceil(mockRoles.length / (params?.limit ?? 10)),
		},
	}
}

/**
 * Get a single role by ID
 */
export async function getRoleById(id: string): Promise<Role> {
	// TODO: Replace with actual API call
	// const { data } = await axiosInstance.get<Role>(`/roles/${id}`)
	// return data

	await new Promise(resolve => setTimeout(resolve, 100))
	const role = mockRoles.find(r => r.id === id)
	if (!role) {
		throw new Error(`Role with id ${id} not found`)
	}
	return role
}

/**
 * Create a new role
 */
export async function createRole(payload: CreateRoleDto): Promise<Role> {
	// TODO: Replace with actual API call
	// const { data } = await axiosInstance.post<Role>("/roles", payload)
	// return data

	await new Promise(resolve => setTimeout(resolve, 100))
	const newRole: Role = {
		id: Math.random().toString(36).substring(7),
		...payload,
	}
	mockRoles.push(newRole)
	return newRole
}

/**
 * Update an existing role
 */
export async function updateRole(id: string, payload: UpdateRoleDto): Promise<Role> {
	// TODO: Replace with actual API call
	// const { data } = await axiosInstance.put<Role>(`/roles/${id}`, payload)
	// return data

	await new Promise(resolve => setTimeout(resolve, 100))
	const roleIndex = mockRoles.findIndex(r => r.id === id)
	if (roleIndex === -1) {
		throw new Error(`Role with id ${id} not found`)
	}
	const updatedRole: Role = {
		...mockRoles[roleIndex],
		...payload,
	}
	mockRoles[roleIndex] = updatedRole
	return updatedRole
}

/**
 * Delete a role
 */
export async function deleteRole(id: string): Promise<void> {
	// TODO: Replace with actual API call
	// await axiosInstance.delete(`/roles/${id}`)

	await new Promise(resolve => setTimeout(resolve, 100))
	const roleIndex = mockRoles.findIndex(r => r.id === id)
	if (roleIndex === -1) {
		throw new Error(`Role with id ${id} not found`)
	}
	mockRoles.splice(roleIndex, 1)
}
