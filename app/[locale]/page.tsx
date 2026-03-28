import { redirect } from "next/navigation";

export default async function Home({ params }: any) {
  const { locale } = await params;
  redirect(`/${locale}/manage-compensation`);
}
