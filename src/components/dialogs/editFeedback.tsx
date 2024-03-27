"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setSubmissionFeedback } from '@/actions/setSubmissionFeedback';

const formSchema = z.object({
  code: z.string(),
  name: z.string(),
});


export default function EditFeedbackDialog({ submissionId }: { submissionId }) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      
    },
  });

  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
         
      await setSubmissionFeedback({submission_id : submissionId, feedback: values.name});
      window.location.reload();
   
    } catch (error) {
      console.error(error);
    }
  }

  

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Edit Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit the current feedback</DialogTitle>
          <DialogDescription>
            Type your updated feedback in the box below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <textarea {...form.register("name")} className="w-full border rounded-md p-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button type="submit">Submit</Button>
            
          </form>
        </Form>
        
      </DialogContent>
      
    </Dialog>
  );
}
