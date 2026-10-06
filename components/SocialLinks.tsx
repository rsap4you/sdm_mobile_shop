import { SOCIALS } from "@/lib/shop";

export default function SocialLinks() {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      {SOCIALS.map(({ label, href, Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          style={{ color, lineHeight: 0 }}
        >
          <Icon size={40} />
        </a>
      ))}
    </div>
  );
}