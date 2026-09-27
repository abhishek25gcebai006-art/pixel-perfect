import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Aurora } from "@/components/Aurora";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GIG_CATEGORIES, LANGUAGES, STATES } from "@/lib/gigsaathi";

type Mode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => {
    const mode = search["mode"];
    return mode === "signup" || mode === "forgot" || mode === "signin" ? { mode } : {};
  },
  head: () => ({
    meta: [
      { title: "Sign in — GigSaathi" },
      { name: "description", content: "Sign in or create your GigSaathi worker account." },
      { property: "og:title", content: "Sign in — GigSaathi" },
      {
        property: "og:description",
        content: "Sign in or create your GigSaathi worker account.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(search.mode ?? "signin");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function onSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/dashboard", replace: true });
  }

  async function onSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: {
          full_name: String(form.get("full_name")),
          phone: String(form.get("phone")),
          city: String(form.get("city")),
          state: String(form.get("state")),
          primary_category: String(form.get("primary_category")),
          preferred_language: String(form.get("preferred_language")),
          experience_months: String(form.get("experience_months") || "0"),
        },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data.session) {
      setSent("Check your email and confirm your address to finish creating your account.");
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  async function onForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(String(form.get("email")), {
      redirectTo: window.location.origin + "/reset-password",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent("If that email has an account, a password reset link is on its way.");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <Aurora />
      <div className="panel w-full max-w-lg rounded-3xl p-6 sm:p-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-extrabold">
            G
          </span>
          <span className="font-extrabold tracking-tight">GigSaathi</span>
        </Link>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your worker account"}
          {mode === "forgot" && "Reset your password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "We use these details to set up your worker profile."
            : "Use the email address linked to your GigSaathi account."}
        </p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-mint/30 bg-mint/10 p-4 text-sm text-mint">
            {sent}
          </div>
        ) : mode === "signin" ? (
          <form onSubmit={onSignIn} className="mt-6 space-y-4">
            <Field label="Email" name="email" type="email" required />
            <Field label="Password" name="password" type="password" required />
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        ) : mode === "forgot" ? (
          <form onSubmit={onForgot} className="mt-6 space-y-4">
            <Field label="Email" name="email" type="email" required />
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        ) : (
          <form onSubmit={onSignUp} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="full_name" required />
              <Field label="Phone number" name="phone" type="tel" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Password" name="password" type="password" required minLength={6} />
              <Field label="City" name="city" required />
              <SelectField label="State" name="state" options={[...STATES]} />
              <SelectField
                label="Primary gig category"
                name="primary_category"
                options={[...GIG_CATEGORIES]}
              />
              <SelectField
                label="Preferred language"
                name="preferred_language"
                options={[...LANGUAGES]}
              />
              <Field
                label="Months working as a gig worker"
                name="experience_months"
                type="number"
                min={0}
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Creating account…" : "Create account"}
            </Button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {mode !== "signin" && (
            <button
              onClick={() => {
                setSent(null);
                setMode("signin");
              }}
              className="transition-colors hover:text-foreground"
            >
              Sign in instead
            </button>
          )}
          {mode !== "signup" && (
            <button
              onClick={() => {
                setSent(null);
                setMode("signup");
              }}
              className="transition-colors hover:text-foreground"
            >
              Create an account
            </button>
          )}
          {mode !== "forgot" && (
            <button
              onClick={() => {
                setSent(null);
                setMode("forgot");
              }}
              className="transition-colors hover:text-foreground"
            >
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...rest} />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={options[0]}
        className="h-9 w-full rounded-md border border-input bg-glass px-3 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-popover">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
