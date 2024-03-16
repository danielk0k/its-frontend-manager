import { redirect } from "next/navigation";
import NewCourseDialog from "@/components/dialogs/newCourse";
import { getUserProps } from "@/actions/getUserProps";

export default async function MyCourseView() {
  const user = await getUserProps();
  if (!user.props.user) {
    redirect("/");
  }

  // Check if user role is 'TEACHER'
  const isTeacher = user.props.user.role === 'TEACHER';
  
  return (
    <div>
      MyCourseView
      {isTeacher && <NewCourseDialog user={user.props.user}></NewCourseDialog>}
    </div>
  );
}
