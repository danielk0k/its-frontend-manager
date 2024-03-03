// Sample page to test create new question and upload reference program for teachers

"use client";

import { useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { PutBlobResult } from "@vercel/blob";
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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  entry_function: z.string(),
  io_input: z.string(),
  func_args: z.string(),
});

export default function NewQuestionForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      entry_function: "main",
      io_input: "[]",
      func_args: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!inputFileRef.current?.files) {
        throw new Error("No file selected");
      }

      const file = inputFileRef.current.files[0];

      const response = await fetch(
        `/api/upload/program?filename=${file.name}`,
        {
          method: "POST",
          body: file,
        }
      );

      const newBlob = (await response.json()) as PutBlobResult;

      const res = await fetch("/api/upload/question", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          reference_program_id: newBlob.url,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center max-w-lg">
      <Form {...form}>
        <h2>Create new question</h2>
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Upload Reference Program</FormLabel>
            <FormControl>
              <Input name="file" ref={inputFileRef} type="file" />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
