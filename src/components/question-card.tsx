import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  type QuestionCardProps = {
    question_title: string;
    question_description: string;
  };
  
  export default function QuestionCard({
    question_title,
    question_description,
  }: QuestionCardProps) {
    return (
      <Card style={{ width: '230px', height: '200px' }}>
          <CardHeader>
            <CardTitle>{question_title}</CardTitle>
          </CardHeader>
          <CardContent>
              <div>
                <p style={{ fontSize: '9'}}>{question_description}</p>
              </div>
          </CardContent>
        </Card>
    );
  }


  
  