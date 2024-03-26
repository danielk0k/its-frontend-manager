"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z, TypeOf } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MailOutlined, LockOutlined, BankOutlined } from '@ant-design/icons';

const formSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type ResetPasswordInput = TypeOf<typeof formSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmitHandler: SubmitHandler<ResetPasswordInput> = async (values) => {
    try {
      setSubmitting(true);
      setError(null);

      const dataToSend = {
        ...values,
        token: token,
      }

      const res = await fetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const message = (await res.json()).message;
          setError('An error occurred during registration.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        signIn(undefined, { callbackUrl: "/" });
      }, 3000);

    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
        {error && (
          <p style={{
            backgroundColor: '#ffcccc',
            fontWeight: '500',
            color: 'red',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
          }}>{error}</p>
        )}
        {success && (
          <p style={{
            backgroundColor: '#ccffcc',
            fontWeight: '500',
            color: 'green',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            fontSize: '10px'
          }}>Password changed successful. Redirecting to sign-in...</p>
        )}
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                <LockOutlined style={{marginRight: 8}}/>
                <Input type="password" placeholder="e.g. iloveits123" {...register('password')}/>
              </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div style={{ textAlign: "center", paddingBottom: 15, paddingTop: 10 }}>
          <Button type="submit" style={{ width: 200, borderRadius: 10 }} disabled={submitting}>
            Change password
          </Button>
        </div>
      </form>
      <hr style={{ borderColor: "gray" }} />
    </Form>
  );
}
