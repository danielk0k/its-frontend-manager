import { Button } from "@/components/ui/button";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default async function ForgotPasswordView() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: "70%" }}>{/* to add image */}</div>
      <div style={{ flex: "30%", backgroundColor: "#ccc", padding: "20px" }}>
        <ForgotPasswordForm />
        <div
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
          }}
        >
          <div style={{ display: "flex" }}>
            <p style={{ color: "gray" }}>{"Have an account?"}</p>
          </div>
          <div>
            <Button variant="link">
              <Link href="/signin">Login now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
