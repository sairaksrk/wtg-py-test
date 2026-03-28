import { MasterSelectProps } from "@/types/api"
import { api } from "./api"

/**
 * Get a master list of mas_titles
 */
export async function getMasterMasTitleList(params?: { lang?: string }): Promise<MasterSelectProps[]> {
	return api<MasterSelectProps[]>("GET", `/mas-title`, undefined, {
		plugin: "master",
		params,
	})
}

export async function getPositionTypeList(params?: { lang?: string }): Promise<MasterSelectProps[]> {
	return api<MasterSelectProps[]>("GET", `/position-types`, undefined, {
		plugin: "master-data-rp",
		params,
	})
}

export async function getPositionLevelList(params?: { lang?: string }): Promise<MasterSelectProps[]> {
	return api<MasterSelectProps[]>("GET", `/position-levels`, undefined, {
		plugin: "master-data-rp",
		params,
	})
}

export async function getPositionList(params?: { lang?: string }): Promise<MasterSelectProps[]> {
	return api<MasterSelectProps[]>("GET", `/positions`, undefined, {
		plugin: "master-data-rp",
		params,
	})
}
