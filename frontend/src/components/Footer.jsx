import React from "react";
import { Image, FooterSection } from '../common';

export default function Footer() {
  // Items for Logo + Social
  const logoSocialItems = [
    { type: 'logo' },
    { type: 'social', icons: [
      { icon: 'facebook', href: '#' },
      { icon: 'youtube', href: '#' },
      { icon: 'instagram', href: '#' },
      { icon: 'google-plus-g', href: '#' },
      { icon: 'linkedin', href: '#' },
    ]}
  ];

  // Items for Contact
  const contactItems = [
    { label: '1-866-449-9998' },
    { label: '905-475-3367' },
    { label: 'Fax - 905-475-2894' },
    { label: 'info@densndente.ca', href: 'mailto:info@densndente.ca' }
  ];

  return (
    <footer className="bg-white text-gray-800 px-6 py-10 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
        {/* Logo + Social */}
        <FooterSection
          items={logoSocialItems}
          itemRender={item => {
            if (item.type === 'logo') {
              return <Image src="/logo-footer.png" alt="Dens 'n Dente Logo" className="h-8 mb-4" />;
            }
            if (item.type === 'social') {
              return (
                <div className="flex gap-4 text-xl text-gray-700">
                  {item.icons.map((icon, idx) => (
                    <a key={icon.icon} href={icon.href}>
                      <i className={`fab fa-${icon.icon}`}></i>
                    </a>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />

        {/* Location */}
        <FooterSection title="LOCATION">
          <p>91 Granton Drive,<br />Richmond Hill, ON<br />L4B 2N5</p>
        </FooterSection>

        {/* Contact */}
        <FooterSection
          title="CONTACT US"
          items={contactItems}
          itemRender={item =>
            item.href ? (
              <a href={item.href} className="hover:underline">{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )
          }
        />

        {/* Legal */}
        <FooterSection
          title="LEGAL"
          items={[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms & Conditions / Refund Policy", href: "#" },
            { label: "Web Store Return Process", href: "#" },
            { label: "Pick Up Process", href: "#" }
          ]}
        />
      </div>

      <div className="border-t mt-8 pt-4 text-center text-gray-500 text-xs">
        &copy; 2025 Smiles First Corporation. All rights reserved.
        <div className="mt-2 space-x-4 text-blue-600">
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
