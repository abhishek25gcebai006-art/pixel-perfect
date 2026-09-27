import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const platformsQuery = queryOptions({
  queryKey: ["gig_platforms"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("gig_platforms")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const benefitsQuery = queryOptions({
  queryKey: ["benefits"],
  queryFn: async () => {
    const { data, error } = await supabase.from("benefits").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", auth.user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const rolesQuery = queryOptions({
  queryKey: ["roles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("user_roles").select("role");
    if (error) throw error;
    return data.map((r) => r.role);
  },
});

export const earningsQuery = queryOptions({
  queryKey: ["earnings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("earnings")
      .select("*")
      .order("entry_date", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const documentsQuery = queryOptions({
  queryKey: ["documents"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("uploaded_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const workerPlatformsQuery = queryOptions({
  queryKey: ["worker_platforms"],
  queryFn: async () => {
    const { data, error } = await supabase.from("worker_platforms").select("*").order("platform_name");
    if (error) throw error;
    return data;
  },
});

export const workerBenefitsQuery = queryOptions({
  queryKey: ["worker_benefits"],
  queryFn: async () => {
    const { data, error } = await supabase.from("worker_benefits").select("*");
    if (error) throw error;
    return data;
  },
});

export const subscriptionQuery = queryOptions({
  queryKey: ["subscription"],
  queryFn: async () => {
    const { data, error } = await supabase.from("subscriptions").select("*").maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const notificationsQuery = queryOptions({
  queryKey: ["notifications"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const applicationsQuery = queryOptions({
  queryKey: ["applications"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});
