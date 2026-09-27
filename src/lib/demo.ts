import { supabase } from "@/integrations/supabase/client";
import { isoDate } from "@/lib/gigsaathi";

const PLATFORM_MIX = [
  { name: "Zomato", base: 620 },
  { name: "Uber", base: 540 },
  { name: "Rapido", base: 380 },
];

/**
 * Fills the signed-in account with clearly-labelled demo records so the
 * dashboard, charts and document states can be explored immediately.
 */
export async function loadDemoData(userId: string) {
  const earnings: Array<Record<string, unknown>> = [];
  for (let i = 0; i < 60; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    for (const p of PLATFORM_MIX) {
      const wave = 1 + Math.sin(i / 3) * 0.25 + (day.getDay() >= 5 ? 0.18 : 0);
      const gross = Math.round(p.base * wave);
      earnings.push({
        user_id: userId,
        entry_date: isoDate(day),
        platform: p.name,
        gross,
        incentives: Math.round(gross * 0.12),
        tips: Math.round(gross * 0.05),
        expenses: Math.round(gross * 0.18),
        trips: Math.max(3, Math.round(gross / 95)),
      });
    }
  }

  const soon = new Date();
  soon.setDate(soon.getDate() + 21);
  const gone = new Date();
  gone.setDate(gone.getDate() - 12);
  const far = new Date();
  far.setFullYear(far.getFullYear() + 3);

  const documents = [
    { doc_type: "Aadhaar", name: "Aadhaar card", status: "verified", expiry_date: null },
    { doc_type: "PAN", name: "PAN card", status: "verified", expiry_date: null },
    {
      doc_type: "Driving licence",
      name: "Driving licence",
      status: "pending",
      expiry_date: isoDate(far),
    },
    {
      doc_type: "Vehicle RC",
      name: "Vehicle RC book",
      status: "verified",
      expiry_date: isoDate(soon),
    },
    {
      doc_type: "Insurance",
      name: "Two-wheeler insurance",
      status: "verified",
      expiry_date: isoDate(gone),
    },
  ].map((d) => ({ ...d, user_id: userId, notes: "Demo record" }));

  const platforms = PLATFORM_MIX.map((p, i) => ({
    user_id: userId,
    platform_name: p.name,
    is_active: true,
    rating: [4.8, 4.6, 4.7][i] ?? 4.6,
  }));

  const notifications = [
    {
      user_id: userId,
      title: "Two-wheeler insurance has expired",
      body: "Renew it and upload the new policy to keep your documents in order.",
      kind: "document",
    },
    {
      user_id: userId,
      title: "Vehicle RC expires in 3 weeks",
      body: "Start the renewal now to avoid a gap.",
      kind: "document",
    },
    {
      user_id: userId,
      title: "You crossed ₹25,000 this month",
      body: "Your best month so far on GigSaathi.",
      kind: "earnings",
    },
    {
      user_id: userId,
      title: "New benefit available: e-Shram registration",
      body: "Registering unlocks several welfare schemes for unorganised workers.",
      kind: "benefit",
    },
  ];

  await supabase.from("earnings").delete().eq("user_id", userId);
  await supabase.from("documents").delete().eq("user_id", userId);

  const results = await Promise.all([
    supabase.from("earnings").insert(earnings),
    supabase.from("documents").insert(documents),
    supabase.from("worker_platforms").upsert(platforms, { onConflict: "user_id,platform_name" }),
    supabase.from("notifications").insert(notifications),
    supabase
      .from("profiles")
      .update({ is_demo: true, avg_rating: 4.7, total_trips: 1860 })
      .eq("id", userId),
  ]);

  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}
