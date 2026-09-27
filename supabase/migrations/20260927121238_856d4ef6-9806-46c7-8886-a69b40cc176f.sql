CREATE TYPE public.app_role AS ENUM ('admin','worker');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  phone text,
  email text,
  city text,
  state text,
  primary_category text,
  preferred_language text DEFAULT 'English',
  experience_months integer DEFAULT 0,
  vehicle_type text,
  avg_rating numeric(3,2) DEFAULT 0,
  total_trips integer DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT false,
  notify_documents boolean NOT NULL DEFAULT true,
  notify_benefits boolean NOT NULL DEFAULT true,
  notify_earnings boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  renews_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription" ON public.subscriptions FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, city, state, primary_category, preferred_language, experience_months)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'primary_category',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language','English'),
    COALESCE((NEW.raw_user_meta_data->>'experience_months')::int, 0)
  ) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'worker') ON CONFLICT DO NOTHING;
  INSERT INTO public.subscriptions (user_id, plan) VALUES (NEW.id,'free') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  doc_type text NOT NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  file_path text,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  expiry_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own documents read" ON public.documents FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own documents insert" ON public.documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own documents update" ON public.documents FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (true);
CREATE POLICY "own documents delete" ON public.documents FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER docs_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_date date NOT NULL DEFAULT current_date,
  platform text NOT NULL,
  gross numeric(10,2) NOT NULL DEFAULT 0,
  incentives numeric(10,2) NOT NULL DEFAULT 0,
  tips numeric(10,2) NOT NULL DEFAULT 0,
  expenses numeric(10,2) NOT NULL DEFAULT 0,
  net numeric(10,2) GENERATED ALWAYS AS (gross + incentives + tips - expenses) STORED,
  trips integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.earnings TO authenticated;
GRANT ALL ON public.earnings TO service_role;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own earnings" ON public.earnings FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.gig_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  work_type text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  documents_required text[] NOT NULL DEFAULT '{}',
  application_process text,
  website text,
  vehicle_types text[] NOT NULL DEFAULT '{}',
  cities text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gig_platforms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gig_platforms TO authenticated;
GRANT ALL ON public.gig_platforms TO service_role;
ALTER TABLE public.gig_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platforms public read" ON public.gig_platforms FOR SELECT USING (true);
CREATE POLICY "platforms admin write" ON public.gig_platforms FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.worker_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  joined_on date,
  rating numeric(3,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, platform_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_platforms TO authenticated;
GRANT ALL ON public.worker_platforms TO service_role;
ALTER TABLE public.worker_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own worker platforms" ON public.worker_platforms FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  eligibility text NOT NULL,
  documents_required text[] NOT NULL DEFAULT '{}',
  how_to_apply text NOT NULL,
  provider text,
  is_demo boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.benefits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.benefits TO authenticated;
GRANT ALL ON public.benefits TO service_role;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "benefits public read" ON public.benefits FOR SELECT USING (true);
CREATE POLICY "benefits admin write" ON public.benefits FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.worker_benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  benefit_id uuid NOT NULL REFERENCES public.benefits(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'saved',
  applied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, benefit_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_benefits TO authenticated;
GRANT ALL ON public.worker_benefits TO service_role;
ALTER TABLE public.worker_benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own worker benefits" ON public.worker_benefits FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform_name text NOT NULL,
  status text NOT NULL DEFAULT 'submitted',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  notes text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own applications" ON public.applications FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  kind text NOT NULL DEFAULT 'general',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications" ON public.notifications FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "own docs read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "own docs insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own docs delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

INSERT INTO public.gig_platforms (name, category, work_type, requirements, documents_required, application_process, website, vehicle_types, cities, sort_order) VALUES
('Rapido','Bike taxi','Rides', ARRAY['18+ years','Own two-wheeler','Smartphone with data'], ARRAY['Aadhaar','PAN','Driving licence','Vehicle RC'],'Register online or at a city hub, upload documents, attend a short onboarding, then start accepting rides.','https://rapido.bike', ARRAY['two-wheeler'], ARRAY['Delhi NCR','Bengaluru','Hyderabad','Mumbai','Pune'],1),
('Uber','Ride-hailing','Rides', ARRAY['21+ years','Commercial driving licence','Vehicle with valid permit'], ARRAY['Aadhaar','PAN','Driving licence','Vehicle RC','Insurance'],'Sign up online, complete document verification and a background check, then activate your account.','https://uber.com', ARRAY['four-wheeler','two-wheeler'], ARRAY['Delhi NCR','Mumbai','Bengaluru','Kolkata','Chennai'],2),
('Ola','Ride-hailing','Rides', ARRAY['21+ years','Commercial licence','Vehicle permit'], ARRAY['Aadhaar','PAN','Driving licence','Vehicle RC','Insurance'],'Apply through the partner app, submit documents at a partner centre, complete verification.','https://olacabs.com', ARRAY['four-wheeler','two-wheeler'], ARRAY['Delhi NCR','Mumbai','Bengaluru','Hyderabad'],3),
('Zomato','Food delivery','Delivery', ARRAY['18+ years','Two-wheeler or cycle','Smartphone'], ARRAY['Aadhaar','PAN','Driving licence','Bank proof'],'Apply in the delivery partner app, complete a short training module, collect your kit.','https://zomato.com', ARRAY['two-wheeler','cycle'], ARRAY['Delhi NCR','Mumbai','Bengaluru','Pune','Jaipur'],4),
('Swiggy','Food delivery','Delivery', ARRAY['18+ years','Two-wheeler or cycle','Smartphone'], ARRAY['Aadhaar','PAN','Driving licence','Bank proof'],'Register online, attend a verification slot, receive your delivery kit and start.','https://swiggy.com', ARRAY['two-wheeler','cycle'], ARRAY['Delhi NCR','Mumbai','Bengaluru','Hyderabad','Chennai'],5),
('Blinkit','Quick commerce','Delivery', ARRAY['18+ years','Two-wheeler preferred'], ARRAY['Aadhaar','PAN','Bank proof'],'Apply at a nearby dark store or online, verify documents, join a shift roster.','https://blinkit.com', ARRAY['two-wheeler','cycle'], ARRAY['Delhi NCR','Mumbai','Bengaluru'],6),
('Zepto','Quick commerce','Delivery', ARRAY['18+ years','Two-wheeler or cycle'], ARRAY['Aadhaar','Bank proof'],'Register online, choose a store location and shift, complete verification.','https://zeptonow.com', ARRAY['two-wheeler','cycle'], ARRAY['Delhi NCR','Mumbai','Bengaluru','Hyderabad'],7),
('Porter','Logistics','Delivery', ARRAY['18+ years','Goods vehicle or two-wheeler','Commercial permit for larger vehicles'], ARRAY['Aadhaar','PAN','Driving licence','Vehicle RC','Insurance'],'Register as a driver partner, submit vehicle documents, attend onboarding at a hub.','https://porter.in', ARRAY['two-wheeler','four-wheeler'], ARRAY['Delhi NCR','Mumbai','Bengaluru','Chennai'],8),
('Urban Company','Home services','Services', ARRAY['18+ years','Skill in a service category','Basic tool kit'], ARRAY['Aadhaar','PAN','Bank proof','Skill certificate'],'Apply online for a service category, attend training and an assessment, then get listed.','https://urbancompany.com', ARRAY['two-wheeler','walking'], ARRAY['Delhi NCR','Mumbai','Bengaluru','Pune','Hyderabad'],9);

INSERT INTO public.benefits (name, category, description, eligibility, documents_required, how_to_apply, provider, sort_order) VALUES
('e-Shram registration','Government schemes','National database registration for unorganised workers that unlocks several welfare schemes.','Any unorganised-sector worker aged 16-59 who is not an EPFO/ESIC member.', ARRAY['Aadhaar','Bank proof','Mobile linked to Aadhaar'],'Register on the e-Shram portal or at a Common Service Centre with your Aadhaar-linked mobile number.','Ministry of Labour & Employment',1),
('PM Suraksha Bima Yojana','Insurance','Accidental death and disability cover at a very low yearly premium.','Bank account holders aged 18-70 with auto-debit consent.', ARRAY['Aadhaar','Bank proof'],'Enable the scheme through your bank net banking, branch, or bank mitra before the yearly cut-off.','Government of India',2),
('PM Jeevan Jyoti Bima Yojana','Insurance','Term life cover renewable each year, paid to your nominee.','Bank account holders aged 18-50.', ARRAY['Aadhaar','Bank proof','Nominee details'],'Apply at your bank branch or through net banking with auto-debit consent.','Government of India',3),
('Ayushman Bharat health cover','Health-related benefits','Cashless hospital treatment cover for eligible families at empanelled hospitals.','Families listed in the scheme database; many gig workers now qualify through e-Shram.', ARRAY['Aadhaar','Ration card'],'Check eligibility on the scheme portal or at an empanelled hospital help desk, then get your card made.','National Health Authority',4),
('Atal Pension Yojana','Savings','Guaranteed monthly pension after 60, based on your chosen contribution.','Bank account holders aged 18-40.', ARRAY['Aadhaar','Bank proof'],'Fill the APY form at your bank or through net banking and set up monthly auto-debit.','PFRDA',5),
('Emergency roadside and medical helpline','Emergency assistance','24x7 helpline for accident support, hospital coordination and family intimation while on duty.','All GigSaathi workers with a completed profile.', ARRAY['GigSaathi profile'],'Save the helpline number from your dashboard and call it during an on-duty emergency.','GigSaathi (demo)',6),
('Two-wheeler loan guidance','Loans/credit education','Guidance on comparing vehicle loan offers, interest rates and avoiding predatory lenders.','Workers with at least 6 months of recorded earnings.', ARRAY['Aadhaar','PAN','Bank statement','Earnings record'],'Open the loan guidance module and compare offers before approaching a lender.','GigSaathi (demo)',7),
('Money basics for gig workers','Financial education','Short lessons on saving, EMI traps, tax basics and building an emergency fund.','Open to everyone.', ARRAY[]::text[],'Start the lessons from the Benefits section; no documents needed.','GigSaathi (demo)',8),
('Skill India certification','Skill development','Free and subsidised short courses with certification in driving, logistics and home services.','Indian citizens aged 15-45.', ARRAY['Aadhaar','Photograph'],'Find a nearby training centre on the Skill India portal and enrol in a course.','NSDC',9);
