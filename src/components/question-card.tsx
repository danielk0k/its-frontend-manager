import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { format } from "date-fns";
  
  type QuestionCardProps = {
    question_title: string;
  };
  
  export default function QuestionCard({
    question_title,
  }: QuestionCardProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{question_title}</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  