import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-[#030014]">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <SignIn 
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "w-full",
              card: "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden",
              headerTitle: "text-2xl font-bold tracking-tight text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all rounded-xl",
              socialButtonsBlockButtonText: "font-medium",
              dividerLine: "bg-white/10",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-300 font-medium",
              formFieldInput: "bg-white/5 border-white/10 text-white rounded-xl focus:ring-violet-500 focus:border-violet-500",
              formButtonPrimary: "bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-900/20 transition-all active:scale-95",
              footerActionLink: "text-violet-400 hover:text-violet-300 font-bold",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-violet-400",
            }
          }}
          localization={{
            signIn: {
              start: {
                title: "Sign in to FreeLancer",
              },
            },
          }}
        />
      </div>
    </div>
  );
}