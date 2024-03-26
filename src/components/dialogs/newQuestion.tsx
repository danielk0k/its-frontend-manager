"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@prisma/client";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.string(),
  entry_function: z.string(),
  io_input: z.string(),
  func_args: z.string(),
});

export default function NewQuestionForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const inputRefFileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      language: "",
      entry_function: "main",
      io_input: "[]",
      func_args: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!inputRefFileRef.current?.files) {
        throw new Error("No file selected");
      }

      const refFile = inputRefFileRef.current.files[0];
      const response = await fetch(
        `/api/upload/program?filename=${refFile.name}`,
        {
          method: "POST",
          body: refFile,
        }
      );

      const newBlob = (await response.json()) as PutBlobResult;
      const res = await fetch("/api/upload/question", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          courseId: courseId,
          reference_program: newBlob.url,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setOpen(false);
      form.reset()
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary">New question</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new question</DialogTitle>
          <DialogDescription>
            Ensure all question parameters are set correctly
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                    <Textarea {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                <Input name="file" ref={inputRefFileRef} type="file" />
              </FormControl>
              <FormDescription>
                Upload a file containing the reference solution
              </FormDescription>
            </FormItem>
            <FormField
              control={form.control}
              name="entry_function"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Function</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="io_input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IO Inputs</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="func_args"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Function Arguments</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
