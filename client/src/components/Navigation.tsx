import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <div className="text-2xl font-bold text-primary">
                Mobiliario Urbano
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" data-testid="link-nav-home">
                <Button variant="ghost" size="sm" className="hover-elevate">
                  Inicio
                </Button>
              </Link>
              <Link href="/configurador" data-testid="link-nav-configurator">
                <Button variant="ghost" size="sm" className="hover-elevate">
                  Configurador
                </Button>
              </Link>
              <Link href="/galeria" data-testid="link-nav-gallery">
                <Button variant="ghost" size="sm" className="hover-elevate">
                  Galería
                </Button>
              </Link>
              <Link href="/admin" data-testid="link-nav-admin">
                <Button variant="ghost" size="sm" className="hover-elevate">
                  Admin
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/configurador">
              <Button data-testid="button-quote-now" className="hover-elevate active-elevate-2">
                Cotizar Ahora
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start hover-elevate" data-testid="button-mobile-home">
                Inicio
              </Button>
            </Link>
            <Link href="/configurador" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start hover-elevate" data-testid="button-mobile-configurator">
                Configurador
              </Button>
            </Link>
            <Link href="/galeria" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start hover-elevate" data-testid="button-mobile-gallery">
                Galería
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start hover-elevate" data-testid="button-mobile-admin">
                Admin
              </Button>
            </Link>
            <Link href="/configurador" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full hover-elevate active-elevate-2" data-testid="button-mobile-quote">
                Cotizar Ahora
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
