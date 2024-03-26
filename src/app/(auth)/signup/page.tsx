import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import { getSchools } from "@/actions/getSchools";

export default async function SignUpView() {
  const schools = await getSchools().then(schools => schools ? schools : []);
  return (
    <div className="flex justify-center items-center h-screen" style={{ 
      background: `
        linear-gradient(to bottom, #e0f2f1, #b2dfdb),
        repeating-linear-gradient(
          45deg,
          rgba(178, 223, 219, 0.1),
          rgba(178, 223, 219, 0.1) 10px,
          transparent 10px,
          transparent 20px
        )
      `
    }}>
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-7 text-center">ITS Frontend System Sign Up</h2>
        <RegisterForm schools={schools} />
        <div className="mt-4 flex items-center justify-center">
        <p className="ml-2">Have an account? </p>
        <Button variant="link">
          <Link href="/signin">Login now</Link>
        </Button>
      </div>
      </div>
    </div>
  );
}

