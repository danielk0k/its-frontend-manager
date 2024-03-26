import { redirect } from "next/navigation";
import NewCourseDialog from "@/components/dialogs/newCourse";
import { getUserProps } from "@/actions/getUserProps";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/course-card";
import { getCourses } from "@/actions/getCourses";


interface Course {
  id: string,
  code: string,
  name: string,
}

export default async function MyCourseView() {
  const userProps = await getUserProps();
  if (!userProps.props.user) {
    redirect("/");
  }

  // Check if user role is 'TEACHER'
  const isTeacher = userProps.props.user.role === 'TEACHER';

  const user = userProps.props.user;
  
  //fetch courses
  
  
  const courseUser = await getCourses({userEmail: `${user.email}`}).then(courses => courses ? courses : {created_courses: [], joined_courses: []}); //user with courses values
  const joinedCourses = courseUser.joined_courses;
  const createdCourses = courseUser.created_courses;

  const defaultTab = isTeacher ? 'createdcourses' : 'joinedcourses';


  return (
    <div>
    <Tabs defaultValue={defaultTab} asChild>
    <section className="grid grid-cols-8 gap-4 p-4">
        <div className="col-span-1 flex flex-col space-y-4">
        <p className="text-lg font-semibold">{"My Courses"}</p> 
        {/*Conditional rendering of "create new question" based on whether user is the creator of the course*/}
        <TabsList>
            {isTeacher && <TabsTrigger value="createdcourses">Created Courses</TabsTrigger>}
            <TabsTrigger value="joinedcourses">Joined Courses</TabsTrigger>
            <TabsTrigger value="allcourses">All Courses</TabsTrigger>
        </TabsList>
        {isTeacher && (
          <div>
            <NewCourseDialog user={user}></NewCourseDialog>
          </div>
        )}
        </div>
        <div className="col-span-7 border rounded-md p-4">
        {isTeacher && <TabsContent value="createdcourses" className="grid grid-cols-4 gap-4">
        {createdCourses.map((course, index) => (
          <Link key={index} href={`/courses/${course.code}`}>
              <CourseCard
                  course_title={course.code}
                  course_name={course.name}
              />
          </Link>
          ))}
        </TabsContent>}
        <TabsContent value="joinedcourses" className="grid grid-cols-4 gap-4">
        {joinedCourses.map((course, index) => (
          <Link key={index} href={`/courses/${course.code}`}>
              <CourseCard
                  course_title={course.code}
                  course_name={course.name}
              />
          </Link>
          ))}
        </TabsContent>
        <TabsContent value="allcourses">
            List of All Courses
        </TabsContent>
        </div>
    </section>
    </Tabs>    
    </div>
);
}








