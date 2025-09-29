import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Leaf, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { label: "About Us", href: "/#about" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Herb Portal", href: "/herb-portal" },
    { label: "Contact", href: "/#contact" },
    { label: "Support", href: "/#support" }
  ];

  const forStakeholders = [
    { label: "For Farmers", href: "/#farmers" },
    { label: "For Brands", href: "/#brands" },
    { label: "For Retailers", href: "/#retailers" },
    { label: "For Labs", href: "/#labs" },
    { label: "Partnership Program", href: "/#partners" }
  ];

  const legal = [
    { label: "Privacy Policy", href: "/#privacy" },
    { label: "Terms of Service", href: "/#terms" },
    { label: "Cookie Policy", href: "/#cookies" },
    { label: "Data Security", href: "/#security" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Instagram, href: "#instagram", label: "Instagram" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Ayurchain</h2>
                <p className="text-primary-foreground/80 text-sm">Trust, Verified from Root to You</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 leading-relaxed mb-6 max-w-md">
              Revolutionizing Ayurvedic supply chains with blockchain transparency. 
              Ensuring authentic, traceable herbs from farm to your hands.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@ayurchain.com</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 1234 567 890</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Stakeholders */}
          <div>
            <h3 className="text-lg font-semibold mb-6">For Stakeholders</h3>
            <ul className="space-y-3">
              {forStakeholders.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Get the latest updates on herb authenticity and blockchain innovation.
            </p>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 text-sm focus:outline-none focus:border-primary-foreground/40"
              />
              <Button variant="glass" size="sm">
                Subscribe
              </Button>
            </div>

            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-smooth text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-primary-foreground/80 text-sm">
              © 2024 Ayurchain. All rights reserved. Built with transparency and trust.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground/80 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-smooth"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;