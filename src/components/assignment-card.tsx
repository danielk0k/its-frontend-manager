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
  question_title: string;
  question_description: string | null;

};
export default function AssignmentCard({
  question_title,
  question_description
}: AssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question_title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2">
          <div>
            <p className="font-medium">{question_description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
