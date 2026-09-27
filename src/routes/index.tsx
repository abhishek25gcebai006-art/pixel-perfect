import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Aurora } from "@/components/Aurora";
import { benefitsQuery, platformsQuery } from "@/lib/queries";
import { PLANS } from "@/lib/gigsaathi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GigSaathi — Your Work. Your Earnings. Your Benefits. One Place." },
      {
        name: "description",
        content:
          "One digital platform for India's gig workers to manage work, documents, earnings and benefits across delivery, rides and services.",
      },
      {
        property: "og:title",
        content: "GigSaathi — Your Work. Your Earnings. Your Benefits. One Place.",
      },
      {
        property: "og:description",
        content:
          "Track earnings from every platform, keep documents safe and discover benefits you qualify for.",
      },
    ],
  }),
  component: Landing,
});

const WHY = [
  {
    n: "01",
    tone: "text-accent",
    title: "One ledger for every app",
    body: "Record what you earn on Zomato, Swiggy, Rapido, Uber and more, and see the real total.",
  },
  {
    n: "02",
    tone: "text-mint",
    title: "Documents that never lapse",
    body: "Aadhaar, licence, RC and insurance tracked with clear status and expiry warnings.",
  },
  {
    n: "03",
    tone: "text-warn",
    title: "Benefits you already qualify for",
    body: "Insurance, pension and government schemes explained in plain language.",
  },
];

const STEPS = [
  { n: "1", title: "Create your worker profile", body: "Name, city, gig category and experience — under two minutes." },
  { n: "2", title: "Add earnings and documents", body: "Log daily income per platform and upload your paperwork securely." },
  { n: "3", title: "Act on what you see", body: "Renew before expiry, compare platforms and apply for benefits." },
];

const SECURITY = [
  { title: "Your data stays yours", body: "Every record is locked to your account. No other worker can see it." },
  { title: "Private document storage", body: "Uploads sit in a private vault. We never display document numbers publicly." },
  { title: "No hidden sharing", body: "GigSaathi is independent and not affiliated with any gig platform." },
];

const FAQ = [
  {
    q: "Is GigSaathi connected to Zomato, Uber or other platforms?",
    a: "No. GigSaathi is an independent support platform and has no official affiliation with any gig company. Platform details here are for guidance only.",
  },
  {
    q: "Do I have to pay to use it?",
    a: "The Free plan covers the dashboard, earnings tracking, documents and basic benefits discovery. Paid plans add analytics and reminders.",
  },
  {
    q: "Are my documents safe?",
    a: "Uploads go to a private storage area that only you — and a verifier when you ask for verification — can open.",
  },
  {
    q: "Does GigSaathi guarantee work or income?",
    a: "No. We show requirements and categories so you can decide. We never promise earnings.",
  },
  {
    q: "Can I use it in my own language?",
    a: "You can set a preferred language on your profile. Full translation is on the roadmap for this prototype.",
  },
];

function Landing() {
  const { data: platforms } = useQuery(platformsQuery);
  const { data: benefits } = useQuery(benefitsQuery);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Aurora />
      <div className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8">
        <div className="panel gsa-rise flex items-center justify-between rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-extrabold">
              G
            </span>
            <span className="font-extrabold tracking-tight">GigSaathi</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#why" className="transition-colors hover:text-foreground">Why GigSaathi</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#benefits" className="transition-colors hover:text-foreground">Benefits</a>
            <a href="#plans" className="transition-colors hover:text-foreground">Plans</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <Link
            to="/auth"
            className="rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open dashboard
          </Link>
        </div>

        {/* HERO */}
        <section className="grid gap-8 pt-12 lg:grid-cols-2 lg:items-center">
          <div className="gsa-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-glass px-3 py-1 text-xs text-accent">
              Made for India's delivery partners &amp; drivers
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Your Work. Your Earnings. Your Benefits. <span className="text-accent">One Place.</span>
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              One digital platform for India's gig workers to manage work, documents, earnings and
              benefits.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background"
              >
                Get Started
              </Link>
              <a
                href="#benefits"
                className="panel rounded-xl px-5 py-3 text-sm font-semibold"
              >
                Explore Benefits
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {["Zomato", "Swiggy", "Rapido", "Uber", "Ola"].map((p) => (
                <span key={p} className="rounded-lg border border-hairline bg-glass px-3 py-1.5">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="gsa-rise relative">
            <div className="panel rounded-3xl p-5 shadow-2xl shadow-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <p className="text-3xl font-extrabold">₹28,450</p>
                </div>
                <span className="rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-mint">
                  +12%
                </span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-1.5">
                {[38, 52, 44, 66, 58, 78].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-glass-strong"
                    style={{ height: `${h}%` }}
                  />
                ))}
                <div className="h-full flex-1 rounded-t-md bg-gradient-to-t from-primary to-accent" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-hairline bg-glass p-3">
                  <p className="text-[11px] text-muted-foreground">Delivery</p>
                  <p className="font-bold">₹16,900</p>
                </div>
                <div className="rounded-xl border border-hairline bg-glass p-3">
                  <p className="text-[11px] text-muted-foreground">Driving</p>
                  <p className="font-bold">₹11,550</p>
                </div>
              </div>
              <p className="mt-3 text-[10px] tracking-wide text-muted-foreground uppercase">
                Sample figures
              </p>
            </div>
            <div className="panel gsa-float absolute -bottom-5 -left-5 w-44 rounded-2xl p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-mint" />
                <p className="text-xs font-semibold">Aadhaar verified</p>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Vault secure · 4 files</p>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section id="why" className="gsa-rise mt-20 scroll-mt-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Why GigSaathi</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {WHY.map((c) => (
              <div key={c.n} className="panel rounded-2xl p-5">
                <span className={`text-lg font-extrabold ${c.tone}`}>{c.n}</span>
                <h3 className="mt-2 font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="mt-20 scroll-mt-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="panel rounded-2xl p-5">
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-extrabold">
                  {s.n}
                </span>
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PLATFORMS */}
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Supported gig platforms
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Guidance only. GigSaathi is independent and not affiliated with any of these companies.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(platforms ?? []).map((p) => (
              <div key={p.id} className="panel rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{p.name}</p>
                  <span className="rounded-full bg-glass-strong px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    {p.work_type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{p.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section id="benefits" className="mt-20 scroll-mt-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Benefits</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Insurance, pension, health cover and skill schemes — with eligibility and the documents
            you need.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(benefits ?? []).slice(0, 6).map((b) => (
              <div key={b.id} className="panel rounded-2xl p-5">
                <span className="text-[11px] tracking-wide text-accent uppercase">{b.category}</span>
                <h3 className="mt-1 font-bold">{b.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY */}
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Worker security</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {SECURITY.map((s) => (
              <div key={s.title} className="panel rounded-2xl p-5">
                <h3 className="font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PLANS */}
        <section id="plans" className="mt-20 scroll-mt-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Subscription plans</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prototype: plan selection works, payments are not processed.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => {
              const featured = plan.id === "plus";
              return (
                <div
                  key={plan.id}
                  className={
                    featured
                      ? "relative rounded-2xl border border-accent/40 bg-gradient-to-b from-primary/20 to-accent/10 p-6 shadow-xl shadow-accent/10 backdrop-blur-xl"
                      : "panel rounded-2xl p-6"
                  }
                >
                  {featured && (
                    <span className="absolute top-4 right-4 rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                      Most picked
                    </span>
                  )}
                  <p className="text-sm font-semibold">{plan.name}</p>
                  <p className="mt-1 text-3xl font-extrabold">
                    ₹{plan.price}
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.blurb}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                  <Link
                    to="/auth"
                    search={{ mode: "signup" }}
                    className={
                      featured
                        ? "mt-5 block rounded-xl bg-foreground py-2 text-center text-sm font-semibold text-background"
                        : "mt-5 block rounded-xl border border-hairline py-2 text-center text-sm font-semibold"
                    }
                  >
                    Choose {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-20 scroll-mt-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">FAQ</h2>
          <Accordion type="single" collapsible className="panel mt-6 rounded-2xl px-5">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-hairline">
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <footer className="mt-20 flex flex-col gap-2 border-t border-hairline pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 GigSaathi · Prototype build · Not affiliated with any gig platform</span>
          <span>Help · Privacy · Terms</span>
        </footer>
      </div>
    </div>
  );
}
