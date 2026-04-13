import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import RuvaApp from "@/components/RuvaApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <RuvaApp userEmail={user.email} userId={user.id} />;
}
