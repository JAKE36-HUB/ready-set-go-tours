import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
            <span className="text-white font-bold text-lg">RS</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Sign In</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ready Set Go Tours & Travel</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
              headerTitle: "text-slate-900 dark:text-white text-lg",
              headerSubtitle: "text-slate-500 dark:text-slate-400",
              socialButtons: "hidden",
              dividerRow: "hidden",
              formButtonPrimary: "bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white shadow-md shadow-sky-500/20 border-0",
              formFieldInput: "rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 focus:ring-sky-500/30",
              footerActionLink: "text-sky-500 hover:text-sky-600",
              identityPreviewText: "text-slate-600 dark:text-slate-300",
              identityPreview: "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg",
              otpCodeFieldInput: "rounded-lg border-slate-200 dark:border-slate-700",
            },
          }}
        />
      </div>
    </div>
  )
}
