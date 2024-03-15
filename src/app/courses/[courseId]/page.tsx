import AssignmentCard from "@/components/assignment-card";
import QuestionCard from "@/components/question-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserProps } from "@/actions/getUserProps";
import { redirect } from "next/navigation";

interface Question {
    title: string,
    description: string,
    reference_program_id: string,
}

export default async function CourseView({
  params,
}: {
  params: { courseId: string };
}) {
    const userProps = await getUserProps();
    const user = userProps.props.user;
    if (!user) {
      redirect("/");
    }

    const resCourseBody = await fetch(
      "/api/get-data/get-course?courseId=" +
        user.school_id +
        "_" +
        params.courseId,
      {
        method: "GET",
      }
    ).then((res) => res.json());

    if (resCourseBody.status == "error") {
      redirect("/courses");
    }

    // get course questions, display on cards
    const resCourseData = resCourseBody.course;
    const courseQuestions: Question[] = resCourseData.questions;

    return (
        <Tabs defaultValue="questions" asChild>
        <section className="grid grid-cols-8 gap-4 p-4">
            <div className="col-span-1 flex flex-col space-y-4">
            <p className="text-lg font-semibold">{params.courseId}</p>
            <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>
            </div>
            <div className="col-span-7 border rounded-md p-4">
            <TabsContent value="home">Announcements</TabsContent>
            <TabsContent value="questions" className="grid grid-cols-4 gap-4">
                {courseQuestions.map((question, index) => (
                <QuestionCard
                    key={index}
                    question_title={question.title}
                ></QuestionCard>
                ))}
            </TabsContent>
            <TabsContent value="people">
                View your students and teachers here
            </TabsContent>
            </div>
        </section>
        </Tabs>
    );
}
