import AssignmentCard from "@/components/assignment-card";
import QuestionCard from "@/components/question-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserProps } from "@/actions/getUserProps";
import { redirect } from "next/navigation";
import { requestToBodyStream } from "next/dist/server/body-streams";

const sample_assignemnts = [
  {
    assignment_title: "Math Homework",
    due_date: "01/03/2024",
    number_of_questions: 10,
    number_of_submitted_questions: 8,
  },
  {
    assignment_title: "History Essay",
    due_date: "28/02/2024",
    number_of_questions: 5,
    number_of_submitted_questions: 5,
  },
  {
    assignment_title: "Science Lab Report",
    due_date: "05/03/2024",
    number_of_questions: 15,
    number_of_submitted_questions: 12,
  },
  {
    assignment_title: "English Reading",
    due_date: "03/03/2024",
    number_of_questions: 7,
    number_of_submitted_questions: 6,
  },
  {
    assignment_title: "Programming Project",
    due_date: "10/03/2024",
    number_of_questions: 20,
    number_of_submitted_questions: 18,
  },
  {
    assignment_title: "Art Presentation",
    due_date: "07/03/2024",
    number_of_questions: 3,
    number_of_submitted_questions: 3,
  },
  {
    assignment_title: "Physical Education Log",
    due_date: "02/03/2024",
    number_of_questions: 12,
    number_of_submitted_questions: 10,
  },
  {
    assignment_title: "Music Composition",
    due_date: "08/03/2024",
    number_of_questions: 8,
    number_of_submitted_questions: 7,
  },
  {
    assignment_title: "Chemistry Experiment",
    due_date: "06/03/2024",
    number_of_questions: 18,
    number_of_submitted_questions: 15,
  },
  {
    assignment_title: "Geography Quiz",
    due_date: "04/03/2024",
    number_of_questions: 6,
    number_of_submitted_questions: 4,
  },
];

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

    const resCourse = await fetch(process.env.URL + "/api/get-data/get-course?courseId=" + user.school_id + "_" + params.courseId, {
        method: 'GET',
    });
    const resCourseBody = await resCourse.json();

    if (resCourseBody.status == 'error') {
        redirect("../")
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
