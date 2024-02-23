import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Welcome to ITS</h1>
        <div>
          <a href="/register">
            <button>Register</button>
          </a>
        </div>
        <div>
          <a href="/api/auth/signin">
            <button>Sign In</button>
          </a>
        </div>
      </div>
    </main>
  );
}
