import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  type CourseCardProps = {
    course_title: string;
    course_name: string;
  };
  
  export default function CourseCard({
    course_title,
    course_name,
  }: CourseCardProps) {
    return (
      <Card style={{ width: '230px', height: '150px' }}>
          <CardHeader>
            <CardTitle>{course_title}</CardTitle>
          </CardHeader>
          <CardContent>
              <div>
                <p style={{ fontSize: '9'}}>{course_name}</p>
              </div>
          </CardContent>
        </Card>
    );
  }
