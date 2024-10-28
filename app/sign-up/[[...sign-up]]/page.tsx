import { SignUp } from "@clerk/nextjs"
import { motion } from "framer-motion"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">Join Al'Raajih</h1>
          <p className="text-muted-foreground">Start your Quranic journey today</p>
        </div>
        <SignUp appearance={{
          elements: {
            rootBox: "shadow-xl rounded-lg",
            card: "bg-background/60 backdrop-blur-xl border-2",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            formFieldInput: "bg-background border-2",
            footerActionLink: "text-primary hover:text-primary/90",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground"
          }
        }} />
      </motion.div>
    </div>
  )
}