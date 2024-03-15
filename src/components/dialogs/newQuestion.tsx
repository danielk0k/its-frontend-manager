"use client";

import { useState } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@prisma/client";

const formSchema = z.object({
    title: z.string(),
    description: z.string(),
    language: z.string(),
    referenceSolution: z.string(),
  });


export default function NewQuestionDialog({ user, course_name }: { user: User, course_name: String }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        description: "",
        language: "",
        referenceSolution: "",
    },
  });

  const [solution, setReferenceSolution] = useState<String | null>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileType = file.name.split('.').pop();
    if (!['txt', 'c', 'py'].includes(fileType!)) {
        alert('Invalid file type. Please select a txt, c, or py file.');
        return null;
    }

    // Read file as text
    const reader = new FileReader();
    reader.onload = function (event) {
        const fileContent = event.target!.result as string;
        setReferenceSolution(fileContent)
        
    };
    reader.readAsText(file);
}

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/question-management/create-question", {
        method: "POST",
        body: JSON.stringify({
            user_id: user.id,
            course_name: course_name,
            title: values.title,
            description: values.description,
            language: values.language,
            reference_program: solution,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res)
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">New question</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new question for your course</DialogTitle>
          <DialogDescription>
            Questions set cannot be edited! Please ensure all question parameters are set correctly!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programming Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a programming languange" />
                        </SelectTrigger>
                    </FormControl>
                  <SelectContent>
                    <SelectItem value="py">Python</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                  </SelectContent>
                </Select>
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Upload Reference Solution</FormLabel>
              <FormControl>
                <Input type="file" onChange={handleFileUpload} />
              </FormControl>
              <FormDescription>
                Upload a file containing the reference solution.
              </FormDescription>
            </FormItem>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
