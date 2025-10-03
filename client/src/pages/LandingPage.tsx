
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Sparkles, Clock, Sun, Moon, ExternalLink, MessageSquare, Zap, Shield, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-chart-2">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Team Epic
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Stats
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Link href="/login">
              <Button 
                size="sm"
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                data-testid="button-support"
              >
                Access Portal
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-chart-2/10 rounded-full blur-3xl" />

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Professional Support for Team Epic Services
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Your Complete Support
              </span>
              <br />
              <span className="text-foreground">Solution Hub</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get expert assistance for Team Epic websites, EncoreBot, Discord services, and all our premium offerings. 
              Fast, reliable, 24/7 support at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/login">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity shadow-lg gap-2 group"
                  data-testid="button-create-ticket"
                >
                  <MessageSquare className="h-5 w-5" />
                  Submit a Ticket
                  <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="gap-2 hover:bg-primary/5"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-view-services"
              >
                Explore Features
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div id="stats" className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">200+</p>
                <p className="text-sm text-muted-foreground mt-1">Active Servers</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">200k+</p>
                <p className="text-sm text-muted-foreground mt-1">Happy Users</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">99.9%</p>
                <p className="text-sm text-muted-foreground mt-1">Uptime</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">&lt;2hr</p>
                <p className="text-sm text-muted-foreground mt-1">Avg Response</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Support for All Our Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive assistance across the entire Team Epic ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-chart-2 shadow-lg">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    EncoreBot & Discord Services
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Get help with EncoreBot music commands, premium features, custom bot development, and all Discord-related services.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Music Bot</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Premium Support</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Custom Bots</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-chart-2/20 hover:border-chart-2/40 transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-chart-2 to-primary shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-chart-2 transition-colors">
                    Web Development
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Technical support for websites, web applications, hosting issues, and custom development projects.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-chart-2/10 text-chart-2">Websites</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-chart-2/10 text-chart-2">Web Apps</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-chart-2/10 text-chart-2">Hosting</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-500 transition-colors">
                    Roblox Games
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Support for Roblox game development, scripting assistance, bug fixes, and game optimization.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">Game Dev</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">Scripting</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">Bug Fixes</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                    Graphic Design
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Assistance with design projects, revisions, asset requests, and creative consultation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">Design</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">Revisions</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">Assets</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative max-w-7xl mx-auto px-4 md:px-6 py-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Team Epic Support
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience professional, efficient, and friendly support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Response Time</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Average response time under 2 hours. Your tickets are our priority, and we're committed to resolving issues fast.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our support agents are trained professionals with deep knowledge of all Team Epic services and technologies.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Everything</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor your ticket status in real-time, receive updates, and access your complete support history anytime.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative max-w-5xl mx-auto px-4 md:px-6 py-20">
          <div className="relative bg-gradient-to-r from-primary to-chart-2 rounded-3xl p-12 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative text-center text-white space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">
                Join thousands of satisfied users who trust Team Epic for their support needs. 
                Create your first ticket in seconds.
              </p>
              <Link href="/login">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2"
                  data-testid="button-get-started"
                >
                  <MessageSquare className="h-5 w-5" />
                  Access Support Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="relative border-t bg-background/50 backdrop-blur-sm mt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-chart-2">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold">Team Epic</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Professional support for all your Team Epic service needs.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Services</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>EncoreBot</li>
                  <li>Web Development</li>
                  <li>Roblox Games</li>
                  <li>Graphic Design</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/login"><a className="hover:text-foreground transition-colors">Submit Ticket</a></Link></li>
                  <li>Documentation</li>
                  <li>FAQ</li>
                  <li>Status</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>About</li>
                  <li>Contact</li>
                  <li>Privacy</li>
                  <li>Terms</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t text-center text-sm text-muted-foreground">
              © 2025 Team Epic. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
