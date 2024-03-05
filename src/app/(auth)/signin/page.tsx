import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";

export default async function SignInView() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: "70%" }}>{/* to add image */}</div>
      <div style={{ flex: "30%", backgroundColor: "#ccc", padding: "20px" }}>
        <LoginForm />
        <div
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
          }}
        >
          <div style={{ display: "flex" }}>
            <p style={{ color: "gray" }}>{"Don't have an account?"}</p>
          </div>
          <div>
            <Button variant="link">
              <Link href="/signup">Register now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
