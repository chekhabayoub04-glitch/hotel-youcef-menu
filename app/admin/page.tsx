import type { Metadata } from "next";
import { AdminApp } from "./AdminApp";

export const metadata: Metadata = { title: "Administration · Hôtel Youcef", robots: { index: false } };

export default function AdminPage() {
  return <AdminApp />;
}
