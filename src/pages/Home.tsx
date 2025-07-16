
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  CheckCircle, 
  Building,
  Mail,
  Phone,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const getRoleBasedCTA = () => {
    if (!isAuthenticated || !user) {
      return { text: 'Get Started', href: '/team-space', icon: ArrowRight };
    }

    switch (user.role) {
      case 'member':
        return { text: 'Mark Compliance', href: '/compliance-space', icon: CheckCircle };
      case 'validator':
        return { text: 'Validate Reports', href: '/validation-space', icon: Shield };
      case 'team-lead':
        return { text: 'Manage Team', href: '/team-space', icon: Users };
      case 'organization-lead':
        return { text: 'Manage Organization', href: '/organization-space', icon: Building };
      default:
        return { text: 'Get Started', href: '/team-space', icon: ArrowRight };
    }
  };

  const cta = getRoleBasedCTA();

  const roles = [
    {
      title: 'Member',
      description: 'Mark compliance status for devices and controls within assigned teams.',
      responsibilities: [
        'Access assigned devices and compliance controls',
        'Mark compliance status (Check, Cross, Skip)',
        'Provide detailed explanations for findings',
        'Submit configurations for validation'
      ],
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Validator',
      description: 'Review and validate compliance submissions from team members.',
      responsibilities: [
        'Review submitted compliance configurations',
        'Validate or deny compliance submissions',
        'Provide feedback and validation details',
        'Handle queries from team members'
      ],
      icon: Shield,
      color: 'from-brand-green to-brand-green-light'
    },
    {
      title: 'Team Lead & Organization Lead',
      description: 'Manage teams, devices, and organizational compliance oversight.',
      responsibilities: [
        'Add and remove team members',
        'Manage device assignments',
        'Reassign roles and responsibilities',
        'Generate compliance reports'
      ],
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 inline-flex items-center space-x-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center animate-pulse-brand">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
              <span className="text-gradient">Governer</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
              Professional CIS Compliance Management Platform
            </p>

            {isAuthenticated && user && (
              <div className="mb-8 p-6 bg-card rounded-2xl border border-border/50 shadow-lg animate-scale-in">
                <p className="text-lg text-muted-foreground mb-2">Welcome back,</p>
                <p className="text-2xl font-bold text-primary">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role.replace('-', ' ')} at {user.organizationName}
                </p>
              </div>
            )}

            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl animate-fade-in">
              <Link to={cta.href} className="flex items-center space-x-2">
                <cta.icon className="w-5 h-5" />
                <span>{cta.text}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Roles & Responsibilities</h2>
            <p className="text-xl text-muted-foreground">
              Understand your role in the compliance management process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card key={role.title} className="hover-lift smooth-transition animate-fade-in border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4",
                    role.color
                  )}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {role.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is CIS Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">What is CIS?</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-xl leading-relaxed mb-6">
                The <strong className="text-foreground">Center for Internet Security (CIS)</strong> is a non-profit organization 
                that develops globally recognized security standards and best practices to help organizations 
                protect their systems and data against cyber threats.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                CIS Controls provide a prioritized set of actions that collectively form a defense-in-depth 
                set of best practices that mitigate the most common attack vectors. These controls are 
                designed to be implemented in order of priority, with the first controls being the most 
                critical for security.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-green">Implementation Groups</h3>
                  <p className="text-muted-foreground">
                    CIS Controls are organized into Implementation Groups (IG1, IG2, IG3) 
                    based on organization size and cybersecurity sophistication.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-green">Measurable Security</h3>
                  <p className="text-muted-foreground">
                    Each control includes specific safeguards that can be measured and 
                    verified, ensuring consistent security posture across organizations.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-muted-foreground">
              Get in touch with our compliance experts
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card className="p-8 hover-lift smooth-transition">
                <Mail className="w-12 h-12 text-brand-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">Get help with compliance questions</p>
                <a href="mailto:support@governer.com" className="text-brand-green hover:underline">
                  support@governer.com
                </a>
              </Card>

              <Card className="p-8 hover-lift smooth-transition">
                <Phone className="w-12 h-12 text-brand-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">Speak with our experts directly</p>
                <a href="tel:+1-555-GOVERNER" className="text-brand-green hover:underline">
                  +1 (555) GOVERNER
                </a>
              </Card>

              <Card className="p-8 hover-lift smooth-transition">
                <MapPin className="w-12 h-12 text-brand-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Office Location</h3>
                <p className="text-muted-foreground mb-4">Visit us for in-person support</p>
                <address className="text-brand-green not-italic">
                  123 Security Blvd<br />
                  Compliance City, CC 12345
                </address>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
