/**
 * Mockup Menu Data for testing
 */
export const MOCKUP_MENU = [
  {
    id: "59f8f654-d024-4c74-b3ba-5f2b43d35201",
    code: "dash",
    nameTh: "ระบบจัดสรรอัตรากำลัง (RP)",
    nameEn: "(RP)",
    icon: "solar:home-smile-outline",
    furl: "/create-request",
    burl: "http://localhost:4001",
    modules: [
      {
        id: "BHRM03-01",
        parentId: null,
        nameTh: "สร้างคำขอฯ",
        nameEn: "สร้างคำขอฯ",
        url: "/create-request",
        type: "MENU",
        modules: [],
      },
      {
        id: "BHRM03-02",
        parentId: null,
        nameTh: "จัดการคำขอฯ",
        nameEn: "จัดการคำขอฯ",
        url: "/manage-request",
        type: "MENU",
        modules: [],
      },
      {
        id: "BHRM03-03",
        parentId: null,
        nameTh: "อัตรากำลัง",
        nameEn: "อัตรากำลัง",
        url: "manpower",
        type: "MENU",
        modules: [],
      },
      {
        id: "BHRM03-04",
        parentId: null,
        nameTh: "รายงาน",
        nameEn: "รายงาน",
        url: "report",
        type: "MENU",
        modules: [],
      },
    ],
  },
  {
    id: "f23a8739-9a24-4078-98b7-83cf5e1b71b7",
    code: "um",
    nameTh: "ระบบจัดการผู้ใช้งาน",
    nameEn: "User Management",
    furl: "http://localhost:3002",
    burl: "http://localhost:4002",
    icon: "solar:shield-user-outline",
    modules: [],
  },
];

export const MOCKUP_SESSION: any = {
  menu: MOCKUP_MENU,
  user: {
    id: "0a4487ac-b4f7-4194-bf00-eaa16fdcdebd",
    name: "Dev User",
    email: "dev@wewasanad.com",
    emailVerified: true,
    image: null,
    createdAt: "2026-02-25 17:18:38.169",
    updatedAt: "2026-02-25 17:18:38.169",
    username: "dev_user",
    organizationId: "f5ac985d-39d3-4642-bd83-32fe936f4ff1",
  },
  session: {
    id: "gMYrxOZUsjqsi9m40BRzw9YDlG6g4LGK",
    expiresAt: "2026-03-05T16:12:18.802Z",
    token: "zezgP3wpzNEVcE4GVMkUHmlW3LuGqB5Z",
    createdAt: "2026-02-26T16:12:18.802Z",
    updatedAt: "2026-02-26T16:12:18.802Z",
    ipAddress: "",
    userAgent: "Mozilla/5.0",
    userId: "0a4487ac-b4f7-4194-bf00-eaa16fdcdebd",
  },
};