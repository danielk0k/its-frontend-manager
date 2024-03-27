"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from 'react-hook-form';
import { z, TypeOf, object, string } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useState, useTransition  } from 'react';
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
})

type ResetUserInput = TypeOf<typeof formSchema>;

export function ForgotPasswordForm() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: ""
      },
    })

    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
    } = form;


    const onSubmitHandler: SubmitHandler<ResetUserInput> = async (values) => {
        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                  "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const message = (await res.json()).message;
                return;
            }
            signIn(undefined, { callbackUrl: "/" });

        } catch (error: any) {
            setError(error.message);
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 15 }}>
                <p style={{ fontWeight: "bold", fontSize: 20}}> Reset Password</p>
            </div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <FormField
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="👤 Type your email" {...register("email")}/>
                            </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />


                <div style={{ textAlign: 'center', paddingBottom: 15, paddingTop: 5 }}>
                    <Button type="submit" style={{ width: 200, borderRadius: 10 }}>Send reset email</Button>
                </div>
            </form>

            <hr style={{ borderColor: 'gray'}} />
        </Form>
    );


}
