import { RiMailLine, RiPhoneLine } from 'react-icons/ri';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { BiLocationPlus } from 'react-icons/bi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/#pricing' },
        { name: 'Security', href: '/#security' },
        { name: 'Roadmap', href: '/#roadmap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'API Reference', href: '/api' },
        { name: 'Community', href: '/community' },
        { name: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Compliance', href: '/compliance' },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com/collabora8r', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com/collabora8r', label: 'Twitter' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/collabora8r', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://instagram.com/collabora8r', label: 'Instagram' },
  ];

  return (
    <footer className="md:mt-10 md:pt-15 border-t border-gray-200 dark:border-[#1a1a1a] transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-600 mb-4">
              Collabora8r
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Empower your teams to collaborate seamlessly and achieve more together.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-500 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <NavLink
                      to={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm transition-colors"
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 py-8 border-t border-gray-200 dark:border-[#1a1a1a]">
          <div className="flex gap-3">
            <RiMailLine className="text-orange-600 dark:text-orange-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Email</p>
              <a href="mailto:support@collabora8r.com" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm">
                support@collabora8r.com
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <RiPhoneLine className="text-orange-600 dark:text-orange-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Phone</p>
              <a href="tel:+1234567890" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm">
                +1 (234) 567-890
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <BiLocationPlus className="text-orange-600 dark:text-orange-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Location</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                123 Tech Street, San Francisco, CA
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 dark:border-[#1a1a1a] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Collabora8r. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm transition-colors">
                Terms
              </a>
              <a href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;