import { notFound } from "next/navigation";
import { getGame } from "@/lib/games";
import VulnhuntApp from "@/game/VulnhuntApp";
import { createClient, safeGetUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game || game.status !== "live") notFound();

  const supabase = await createClient();
  const user = await safeGetUser(supabase);

  if (slug === "vulnhunt") return <VulnhuntApp guest={!user} />;
  notFound();
}
