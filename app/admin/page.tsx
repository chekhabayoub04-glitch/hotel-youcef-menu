import type { Metadata } from "next";
import { isAuthed } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { AdminDashboard } from "./AdminDashboard";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration · Hôtel Youcef", robots: { index: false } };

export default async function AdminPage() {
  if (!(await isAuthed())) return <LoginForm />;
  const menu = await getRepository().getMenu();
  return <AdminDashboard menu={menu} ephemeral={!!process.env.VERCEL} />;
}
