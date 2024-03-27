"use client";

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setSubmissionGrade } from '@/actions/setSubmissionGrade';

const formSchema = z.object({
  code: z.string(),
  name: z.string(),
  score: z.string().min(0, "Score must be at least 0").max(100, "Score must not exceed 100"),
});


export default function EditScoreDialog({ submissionId }: { submissionId }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
     
    try {
      const scoreValue: number = parseInt(values.score);
      await setSubmissionGrade({submission_id : submissionId, grade: scoreValue});
      window.location.reload();

    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Edit Score</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit the current score</DialogTitle>
          <DialogDescription>
            Assign a score of 0-100.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      min={0}
                      max={100}
                      onInput={(e) => {
                        let inputElement = e.target as HTMLInputElement; 
                        let value = parseInt(inputElement.value);
                        if (isNaN(value) || value < 0) {   
                          inputElement.value = "0";
                        } else if (value > 100) {  
                          inputElement.value = "100";
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
