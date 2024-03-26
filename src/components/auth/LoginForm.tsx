"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from 'react-hook-form';
import { z, TypeOf, object, string } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginUserInput = TypeOf<typeof formSchema>;

export function LoginForm() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callbackUrl = '/courses';
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
      },
    })

    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
    } = form;

    const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
        try {
          setSubmitting(true);
          setError(null);

          const res = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
            redirectTo: callbackUrl,
          });

          setSubmitting(false);

          if (!res?.error) {

            router.push(callbackUrl);
          } else {
            reset({ password: '' });
            const message = "Invalid email or password";
            setError(message);
          }
        } catch (error: any) {
          setError(error.message);
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
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                      <MailOutlined style={{marginRight: 8}}/>
                      <Input style={{ width: "500px" }} placeholder="e.g. john@doe.com" {...register('email')}/>
                    </div>
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your password</FormLabel>
                    <FormControl>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                      <LockOutlined style={{marginRight: 8}}/>
                      <Input type="password" placeholder="e.g. iloveits123" {...register('password')}/>
                    </div>
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />

                <div style={{ textAlign: 'center', paddingBottom: 15, paddingTop: 10 }}>
                    <a href='/forgot-password' style={{ fontSize: 9}} >Forgot Password?</a>
                </div>

                <div style={{ textAlign: 'center', paddingBottom: 15, paddingTop: 5 }}>
                    <Button type="submit" style={{ width: 200, borderRadius: 10 }} disabled={submitting}>Login</Button>
                </div>
            </form>

            <hr style={{ borderColor: 'gray'}} />
        </Form>
      )

}


