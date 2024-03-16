import { redirect } from "next/navigation";
import NewCourseDialog from "@/components/dialogs/newCourse";
import { getUserProps } from "@/actions/getUserProps";

export default async function MyCourseView() {
  const user = await getUserProps();
  if (!user.props.user) {
    redirect("/");
  }

  return (
    <div>
      MyCourseView<NewCourseDialog user={user.props.user}></NewCourseDialog>
    </div>
  );
}
