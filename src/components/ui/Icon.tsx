import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  Check,
  Euro,
  Eye,
  Globe,
  HardHat,
  House,
  Layers,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Receipt,
  Search,
  Server,
  ShieldCheck,
  Siren,
  Star,
  Truck,
  User,
  Users,
  Wrench,
  type LucideProps,
} from "lucide-react";

const ICONS = {
  badge: BadgeCheck,
  building: Building2,
  calendar: CalendarCheck,
  check: Check,
  euro: Euro,
  eye: Eye,
  globe: Globe,
  hardhat: HardHat,
  home: House,
  layers: Layers,
  layout: LayoutDashboard,
  lock: Lock,
  message: MessageCircle,
  receipt: Receipt,
  search: Search,
  server: Server,
  shield: ShieldCheck,
  siren: Siren,
  star: Star,
  truck: Truck,
  user: User,
  users: Users,
  wrench: Wrench,
} as const;

export type IconName = keyof typeof ICONS;

/** Content files refer to icons by key so they stay plain data. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name as IconName] ?? Check;
  return <Cmp aria-hidden="true" {...props} />;
}
