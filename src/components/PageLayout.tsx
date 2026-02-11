import AMPHeader from "@/components/AMPHeader";
import AMPFooter from "@/components/AMPFooter";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const PageLayout = ({ children, title, subtitle }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <AMPHeader />
      <main className="pt-[95px]">
        {title && (
          <div className="bg-gradient-to-r from-amp-navy to-amp-blue py-12">
            <div className="container mx-auto px-4 lg:px-8">
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-white uppercase">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/80 mt-2 text-lg">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        {children}
      </main>
      <AMPFooter />
    </div>
  );
};

export default PageLayout;
