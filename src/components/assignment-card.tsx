import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

type AssignmentCardProps = {
  assignment_title: string;
  due_date: string;
  number_of_questions: Number;
  number_of_submitted_questions: Number;
};

export default function AssignmentCard({
  assignment_title,
  due_date,
  number_of_questions,
  number_of_submitted_questions,
}: AssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignment_title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2">
          <div>
            <p className="font-medium">Submitted</p>
            <p>{`${number_of_submitted_questions} / ${number_of_questions}`}</p>
          </div>
          <div>
            <p className="font-medium">Due Date</p>
            <p>{due_date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
