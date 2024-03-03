import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/signin");
  } else {
    redirect("/courses")
  }
}
