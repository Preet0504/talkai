interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    // 1. Added a subtle dot pattern background for a modern SaaS look
    // 2. Used min-h-screen for better browser compatibility
    <div className="relative min-h-screen w-full bg-slate-50/50 flex flex-col items-center justify-center p-4 md:p-10">
      
      {/* Decorative Background Element */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* 3. max-w-4xl fits the two-column card perfectly. 
         4. Added z-10 to keep it above the background pattern.
         5. Added an entrance animation (animate-in)
      */}
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>

      {/* Footer / Secondary Navigation (Optional) */}
      <footer className="relative z-10 mt-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Talk.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;