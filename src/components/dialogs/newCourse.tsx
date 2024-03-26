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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import { useState } from 'react';

const formSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export default function NewCourseDialog({ user }: { user: User }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      const res = await fetch("/api/course-management/create-course", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          user_role: user.role,
          school_id: user.school_id,
          code: values.code.toUpperCase(),
          name: values.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resBody = await res.json();
      if (resBody.status == 'success') {
        setSuccess(true);
        setTimeout(() => {
          router.push('/courses/' + values.code);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Dialog>

      <DialogTrigger>
        <Button variant="secondary">New Course</Button>
      </DialogTrigger>
      <DialogContent>
      {success && 
        <p style={{
          backgroundColor: '#D1E7DD',
          color: '#155724',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center',
          marginBottom: '10px',
        }}>Course created successfully!</p>
      }
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
          <DialogDescription>
            This action cannot be reversed. Please review the course details carefully before proceeding.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
