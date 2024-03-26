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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
})

type LoginUserInput = TypeOf<typeof formSchema>;

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
            const message = 'invalid email or password';
            setError(message);
          }
        } catch (error: any) {

          setError(error.message);
        } finally {
          setSubmitting(false);
        }
      };

    function handleForgotPasswordClick() {
        console.log("Forgot password clicked");
    }

    return (
        <Form {...form}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 15 }}>
                <p style={{ fontWeight: "bold", fontSize: 20}}> Login</p>
            </div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="👤 Type your email" {...register('email')} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="🔒 Type your password" {...register('password')} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div style={{ textAlign: 'right' }}>
                    <a href='/forgot-password' onClick={handleForgotPasswordClick} style={{ fontSize: 9}} >Forgot Password?</a>
                </div>

                <div style={{ textAlign: 'center', paddingBottom: 15, paddingTop: 5 }}>
                    <Button type="submit" style={{ width: 200, borderRadius: 10 }}>Login</Button>
                </div>
            </form>

            <hr style={{ borderColor: 'gray'}} />
        </Form>
      )

}


