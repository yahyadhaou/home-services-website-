import facts from "./screen-facts.json";

export type Locale = "en" | "de";
export type AppKey = "client" | "manager" | "coworker" | "admin";
export type Group =
  | "discover"
  | "booking"
  | "relocation"
  | "emergency"
  | "account"
  | "dashboard"
  | "jobs"
  | "team"
  | "earnings"
  | "people"
  | "money"
  | "quality";

export type Screen = {
  app: AppKey;
  id: string;
  src: string;
  kind: "phone" | "browser";
  w: number;
  h: number;
  theme: "light" | "dark";
  group: Group;
  title: Record<Locale, string>;
  text: Record<Locale, string>;
};

type Seed = {
  id: string;
  group: Group;
  title: [string, string];
  text: [string, string];
};

const build = (app: AppKey, seeds: Seed[], kindOf: (id: string) => "phone" | "browser"): Screen[] =>
  seeds.map((s) => {
    const f = (facts as Record<string, { w: number; h: number; theme: "light" | "dark" }>)[`${app}/${s.id}`];
    return {
      app,
      id: s.id,
      src: `/shots/${app}/${s.id}.webp`,
      kind: kindOf(s.id),
      w: f.w,
      h: f.h,
      theme: f.theme,
      group: s.group,
      title: { en: s.title[0], de: s.title[1] },
      text: { en: s.text[0], de: s.text[1] },
    };
  });

const phone = () => "phone" as const;

/* Captions are written from what each real screen shows. */
const client: Seed[] = [
  { id: "01", group: "booking", title: ["My bookings", "Meine Buchungen"], text: ["Every booking with its number, provider and status in one list.", "Jede Buchung mit Nummer, Anbieter und Status in einer Liste."] },
  { id: "02", group: "booking", title: ["Pick a date", "Datum wählen"], text: ["Choose urgency and a day on the calendar — normal or emergency.", "Dringlichkeit und Tag im Kalender wählen — normal oder Notfall."] },
  { id: "03", group: "relocation", title: ["Relocation options", "Umzugsoptionen"], text: ["A moving company or an independent helper, with the trade-offs and an estimated price for each.", "Umzugsunternehmen oder selbstständiger Helfer — mit Abwägung und geschätztem Preis."] },
  { id: "04", group: "discover", title: ["Service category", "Servicekategorie"], text: ["Everything under one trade: what you need, good to know, then available professionals.", "Alles zu einem Gewerk: Was wird gebraucht, gut zu wissen, dann verfügbare Profis."] },
  { id: "05", group: "booking", title: ["Date, time and price", "Datum, Zeit und Preis"], text: ["Time slots and the price estimate — gross incl. VAT — before you confirm.", "Zeitfenster und Preisschätzung — brutto inkl. MwSt. — vor der Bestätigung."] },
  { id: "06", group: "relocation", title: ["Where to?", "Wohin?"], text: ["Pick the destination from a built-in city list; the distance is estimated instantly.", "Zielort aus der integrierten Städteliste wählen; die Entfernung wird sofort geschätzt."] },
  { id: "07", group: "relocation", title: ["Tell us about your home", "Ihr Zuhause"], text: ["Apartment or house, rooms, floor and elevator — the inputs behind the price estimate.", "Wohnung oder Haus, Zimmer, Etage und Aufzug — die Eingaben hinter der Preisschätzung."] },
  { id: "08", group: "booking", title: ["My bookings (dark)", "Meine Buchungen (dunkel)"], text: ["The same list in dark mode, with status badges for pending and upcoming jobs.", "Dieselbe Liste im Dunkelmodus, mit Statusanzeigen für offene und anstehende Aufträge."] },
  { id: "09", group: "discover", title: ["Available professionals", "Verfügbare Profis"], text: ["Companies and independents side by side with ratings, distance and hourly rate.", "Unternehmen und Selbstständige nebeneinander — mit Bewertung, Entfernung und Stundensatz."] },
  { id: "10", group: "relocation", title: ["Tell us about your home (light)", "Ihr Zuhause (hell)"], text: ["The same step in light mode: apartment or house, rooms, floor and elevator.", "Derselbe Schritt im Hellmodus: Wohnung oder Haus, Zimmer, Etage und Aufzug."] },
  { id: "11", group: "booking", title: ["Review & confirm", "Prüfen & bestätigen"], text: ["Provider, date, time and the full cost overview, then the service address.", "Anbieter, Datum, Uhrzeit und die komplette Kostenübersicht, dann die Serviceadresse."] },
  { id: "12", group: "account", title: ["Welcome", "Willkommen"], text: ["Sign in or create an account — with social sign-in options.", "Anmelden oder Konto erstellen — mit Social-Login-Optionen."] },
  { id: "13", group: "account", title: ["Profile", "Profil"], text: ["Bookings, favorites, payment methods, saved addresses, messages and settings.", "Buchungen, Favoriten, Zahlungsarten, Adressen, Nachrichten und Einstellungen."] },
  { id: "14", group: "account", title: ["Help & support", "Hilfe & Support"], text: ["FAQs plus live chat, e-mail and phone contact.", "FAQ sowie Live-Chat, E-Mail und Telefonkontakt."] },
  { id: "15", group: "discover", title: ["Nearby (light)", "In der Nähe (hell)"], text: ["Professionals around you, sorted by distance — in light mode.", "Profis in Ihrer Nähe, nach Entfernung sortiert — im Hellmodus."] },
  { id: "16", group: "booking", title: ["Select a time slot", "Zeitfenster wählen"], text: ["Available slots for the chosen day, then how often the service should repeat.", "Verfügbare Zeitfenster für den gewählten Tag, dann die Wiederholung des Services."] },
  { id: "17", group: "booking", title: ["Confirm booking", "Buchung bestätigen"], text: ["Review the booking, check the price and book in one tap.", "Buchung prüfen, Preis kontrollieren und mit einem Tipp buchen."] },
  { id: "18", group: "account", title: ["Create account", "Konto erstellen"], text: ["A short registration with clear terms and privacy notice.", "Eine kurze Registrierung mit klaren Nutzungs- und Datenschutzhinweisen."] },
  { id: "19", group: "account", title: ["Settings (light)", "Einstellungen (hell)"], text: ["Notifications, location, appearance and language in one place.", "Benachrichtigungen, Standort, Darstellung und Sprache an einem Ort."] },
  { id: "20", group: "relocation", title: ["Choose your move", "Umzug wählen"], text: ["The planner recommends a moving company for long distances and explains why.", "Der Planer empfiehlt bei langen Strecken ein Umzugsunternehmen und erklärt warum."] },
  { id: "21", group: "discover", title: ["Plumber", "Klempner"], text: ["Category page with typical jobs, tips and the list of professionals.", "Kategorieseite mit typischen Aufgaben, Tipps und Liste der Profis."] },
  { id: "22", group: "account", title: ["Edit profile", "Profil bearbeiten"], text: ["Personal information and address, saved in one step.", "Persönliche Daten und Adresse — in einem Schritt gespeichert."] },
  { id: "23", group: "account", title: ["Sign in", "Anmelden"], text: ["Welcome back: e-mail, password and a clear path to register.", "Willkommen zurück: E-Mail, Passwort und ein klarer Weg zur Registrierung."] },
  { id: "24", group: "discover", title: ["Nearby", "In der Nähe"], text: ["Providers near you with ratings and distance.", "Anbieter in Ihrer Nähe mit Bewertung und Entfernung."] },
  { id: "25", group: "booking", title: ["Payment method", "Zahlungsart"], text: ["Choose card, Apple Pay or cash on completion.", "Karte, Apple Pay oder Barzahlung nach Abschluss wählen."] },
  { id: "26", group: "discover", title: ["Provider profile", "Anbieterprofil"], text: ["About, reviews and services, opening hours and accepted payment methods.", "Info, Bewertungen und Leistungen, Öffnungszeiten und akzeptierte Zahlungsarten."] },
  { id: "27", group: "booking", title: ["Booking details", "Buchungsdetails"], text: ["Status, provider, date, address and price — plus cancel or back to home.", "Status, Anbieter, Datum, Adresse und Preis — plus Stornieren oder zurück zur Startseite."] },
  { id: "28", group: "booking", title: ["Confirm & pay", "Bestätigen & bezahlen"], text: ["Cost overview, address and payment method on one screen.", "Kostenübersicht, Adresse und Zahlungsart auf einem Bildschirm."] },
  { id: "29", group: "discover", title: ["Home (light)", "Startseite (hell)"], text: ["Search, live dispatch and all service categories at a glance.", "Suche, Live-Disposition und alle Servicekategorien auf einen Blick."] },
  { id: "30", group: "account", title: ["Profile (light)", "Profil (hell)"], text: ["The profile menu in light mode.", "Das Profilmenü im Hellmodus."] },
  { id: "31", group: "account", title: ["Saved addresses", "Gespeicherte Adressen"], text: ["Home and office, ready to reuse for the next booking.", "Zuhause und Büro, bereit für die nächste Buchung."] },
  { id: "32", group: "booking", title: ["Pending booking", "Offene Buchung"], text: ["A freshly placed booking waiting for the provider's confirmation.", "Eine neue Buchung, die auf die Bestätigung des Anbieters wartet."] },
  { id: "33", group: "discover", title: ["Company profile", "Firmenprofil"], text: ["A verified company with rating, response time, hours and payment methods.", "Ein verifiziertes Unternehmen mit Bewertung, Antwortzeit, Öffnungszeiten und Zahlungsarten."] },
  { id: "34", group: "discover", title: ["Home", "Startseite"], text: ["Search, live dispatch and ten service categories.", "Suche, Live-Disposition und zehn Servicekategorien."] },
  { id: "35", group: "account", title: ["Settings", "Einstellungen"], text: ["Notifications, location, dark mode, language and legal links.", "Benachrichtigungen, Standort, Dunkelmodus, Sprache und rechtliche Hinweise."] },
  { id: "36", group: "emergency", title: ["Emergency service", "Notfallservice"], text: ["One tap requests the nearest available pro: burst pipe, gas leak, no power, flooding, lock-out.", "Ein Tipp ruft den nächsten verfügbaren Profi: Rohrbruch, Gasgeruch, Stromausfall, Wasserschaden, ausgesperrt."] },
  { id: "37", group: "account", title: ["Choose your language", "Sprache wählen"], text: ["English, French or German from the very first screen.", "Englisch, Französisch oder Deutsch — gleich auf dem ersten Bildschirm."] },
];

const manager: Seed[] = [
  { id: "01", group: "earnings", title: ["Earnings", "Einnahmen"], text: ["Total revenue, platform fees paid, revenue by category and a team ranking.", "Gesamtumsatz, gezahlte Plattformgebühren, Umsatz je Kategorie und Team-Ranking."] },
  { id: "02", group: "team", title: ["Team", "Team"], text: ["Every member with upcoming, in-progress, completed and pending jobs.", "Jedes Mitglied mit anstehenden, laufenden, erledigten und offenen Aufträgen."] },
  { id: "03", group: "jobs", title: ["Reassign a job", "Auftrag neu zuweisen"], text: ["Move a job to another team member in two taps; they are notified.", "Auftrag mit zwei Tipps an ein anderes Teammitglied übergeben; es wird benachrichtigt."] },
  { id: "04", group: "jobs", title: ["Unassigned jobs", "Nicht zugewiesene Aufträge"], text: ["New bookings waiting for a coworker, each with an Assign button.", "Neue Buchungen warten auf einen Mitarbeiter — jede mit Zuweisen-Button."] },
  { id: "05", group: "team", title: ["Add team member", "Teammitglied hinzufügen"], text: ["Create a coworker account with their trade and a temporary password.", "Mitarbeiterkonto mit Gewerk und temporärem Passwort anlegen."] },
  { id: "06", group: "dashboard", title: ["Dashboard (light)", "Dashboard (hell)"], text: ["Earnings, payout, alert for unassigned jobs, counters and upcoming work.", "Einnahmen, Auszahlung, Hinweis auf offene Aufträge, Kennzahlen und anstehende Arbeit."] },
  { id: "07", group: "dashboard", title: ["Company profile (light)", "Firmenprofil (hell)"], text: ["Legal, tax and payout details — payout fields are always shown as Confidential.", "Rechts-, Steuer- und Auszahlungsdaten — Auszahlungsfelder werden stets als vertraulich angezeigt."] },
  { id: "08", group: "jobs", title: ["Jobs", "Aufträge"], text: ["All company jobs with status filters and clear badges.", "Alle Firmenaufträge mit Statusfiltern und eindeutigen Kennzeichen."] },
  { id: "09", group: "team", title: ["Team member", "Teammitglied"], text: ["Contact, availability, earnings and the member's missions.", "Kontakt, Verfügbarkeit, Einnahmen und die Aufträge des Mitglieds."] },
  { id: "10", group: "dashboard", title: ["Partner portal", "Partnerportal"], text: ["Sign in as company or independent, as manager or team member.", "Anmeldung als Unternehmen oder Selbstständiger, als Verantwortlicher oder Teammitglied."] },
  { id: "11", group: "jobs", title: ["Job detail", "Auftragsdetails"], text: ["Client, address, schedule, assignee, client price and the company's earning.", "Kunde, Adresse, Termin, Zuständiger, Kundenpreis und Firmenverdienst."] },
  { id: "12", group: "dashboard", title: ["Company profile", "Firmenprofil"], text: ["Company details, tax and payout in a calm, readable layout.", "Firmendaten, Steuer und Auszahlung in einem ruhigen, lesbaren Layout."] },
  { id: "13", group: "dashboard", title: ["Dashboard", "Dashboard"], text: ["The whole business at a glance — in dark mode.", "Das ganze Geschäft auf einen Blick — im Dunkelmodus."] },
  { id: "14", group: "dashboard", title: ["Settings", "Einstellungen"], text: ["Language, appearance, location, FAQs and contact for support.", "Sprache, Darstellung, Standort, FAQ und Support-Kontakt."] },
];

const coworker: Seed[] = [
  { id: "01", group: "jobs", title: ["My jobs", "Meine Aufträge"], text: ["Only the jobs assigned to this coworker, with an availability switch.", "Nur die diesem Mitarbeiter zugewiesenen Aufträge — mit Verfügbarkeitsschalter."] },
  { id: "02", group: "earnings", title: ["My earnings", "Meine Einnahmen"], text: ["Total earned, jobs done, average per job and recent earnings.", "Gesamtverdienst, erledigte Aufträge, Durchschnitt je Auftrag und letzte Einnahmen."] },
  { id: "03", group: "dashboard", title: ["Team member sign-in", "Anmeldung als Teammitglied"], text: ["Coworkers choose their role at sign-in and see a view built for them.", "Mitarbeiter wählen ihre Rolle bei der Anmeldung und sehen eine für sie gebaute Ansicht."] },
  { id: "04", group: "dashboard", title: ["My profile", "Mein Profil"], text: ["Contact data, completed jobs and start date — no company finances.", "Kontaktdaten, erledigte Aufträge und Eintrittsdatum — keine Firmenfinanzen."] },
];

const adminSeeds: Seed[] = [
  { id: "a-overview", group: "dashboard", title: ["Overview", "Übersicht"], text: ["Platform-wide KPIs, booking funnel, platform earnings and recent bookings.", "Plattformweite Kennzahlen, Buchungstrichter, Plattformeinnahmen und neueste Buchungen."] },
  { id: "a-companies", group: "people", title: ["Companies", "Unternehmen"], text: ["Every registered company with owner, location, status and activity.", "Jedes registrierte Unternehmen mit Inhaber, Standort, Status und Aktivität."] },
  { id: "a-company", group: "people", title: ["Company detail", "Unternehmensdetails"], text: ["Business details, activity and approve/reject — payout data stays confidential.", "Geschäftsdaten, Aktivität und Freigabe/Ablehnung — Auszahlungsdaten bleiben vertraulich."] },
  { id: "a-independents", group: "people", title: ["Independents", "Selbstständige"], text: ["Solo providers with category, status and booking counts.", "Einzelanbieter mit Kategorie, Status und Buchungsanzahl."] },
  { id: "a-workers", group: "people", title: ["Workers", "Mitarbeiter"], text: ["All coworkers with their company, specialty and availability.", "Alle Mitarbeiter mit Unternehmen, Fachgebiet und Verfügbarkeit."] },
  { id: "a-clients", group: "people", title: ["Clients", "Kunden"], text: ["Client accounts with booking counts and status for support cases.", "Kundenkonten mit Buchungsanzahl und Status für Supportfälle."] },
  { id: "a-bookings", group: "quality", title: ["Bookings", "Buchungen"], text: ["Every booking across the platform, filterable and searchable.", "Jede Buchung der Plattform — filter- und durchsuchbar."] },
  { id: "a-booking", group: "quality", title: ["Booking detail", "Buchungsdetails"], text: ["Job, pricing with the 12% fee, payment attempt and review in one page.", "Auftrag, Preise mit 12 % Gebühr, Zahlungsversuch und Bewertung auf einer Seite."] },
  { id: "a-payments", group: "money", title: ["Payments", "Zahlungen"], text: ["Payment records per booking with amount, status and timestamps.", "Zahlungen je Buchung mit Betrag, Status und Zeitstempel."] },
  { id: "a-reviews", group: "quality", title: ["Reviews", "Bewertungen"], text: ["All client reviews with rating, provider and booking.", "Alle Kundenbewertungen mit Wertung, Anbieter und Buchung."] },
  { id: "a-login", group: "dashboard", title: ["Admin sign-in", "Admin-Anmeldung"], text: ["A dedicated sign-in for platform staff only.", "Eine eigene Anmeldung ausschließlich für das Plattform-Team."] },
  { id: "a-mobile-overview", group: "dashboard", title: ["On a phone", "Auf dem Smartphone"], text: ["The same dashboard, fully responsive down to phone width.", "Dasselbe Dashboard, vollständig responsiv bis zur Smartphone-Breite."] },
];

export const SCREENS: Record<AppKey, Screen[]> = {
  client: build("client", client, phone),
  manager: build("manager", manager, phone),
  coworker: build("coworker", coworker, phone),
  admin: build("admin", adminSeeds, (id) => (id === "a-mobile-overview" ? "phone" : "browser")),
};

export const APP_ORDER: AppKey[] = ["client", "manager", "coworker", "admin"];

/** First screens used by the hero and the app sections. */
export const pick = (app: AppKey, id: string): Screen => {
  const s = SCREENS[app].find((x) => x.id === id);
  if (!s) throw new Error(`Unknown screen ${app}/${id}`);
  return s;
};
