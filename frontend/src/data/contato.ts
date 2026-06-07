import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ContactChannel = {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
};

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    label: "E-mail",
    value: "contato@terranova.com.br",
    href: "mailto:contato@terranova.com.br",
    icon: Mail,
  },
  {
    id: "phone",
    label: "Telefone",
    value: "(11) 9999-9999",
    href: "tel:+551199999999",
    icon: Phone,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "(11) 99999-9999",
    href: "https://wa.me/5511999999999",
    icon: MessageCircle,
  },
  {
    id: "location",
    label: "Base",
    value: "Av. Paulista, 1100, SP",
    href: "https://maps.google.com/?q=Av.+Paulista,+1100,+São+Paulo,+SP",
    icon: MapPin,
  },
];

export const contactCopy = {
  channelsTitle: "Canais diretos",
  channelsDescription:
    "Dúvidas sobre a plataforma, parcerias ou uso no campo.",
  formTitle: "Envie uma mensagem",
  formDescription: "Envie sua mensagem. Respondemos por e-mail.",
};
