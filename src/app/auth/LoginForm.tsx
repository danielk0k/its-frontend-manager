"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
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

   
export function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
      },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        }

    function handleForgotPasswordClick() {
        console.log("Forgot password clicked");
    }

    return (
        <Form {...form}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 15 }}>
                <p style={{ fontWeight: "bold", fontSize: 20}}> Login</p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="👤 Type your email" {...field} />
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
                        <Input type="password" placeholder="🔒 Type your password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div style={{ textAlign: 'right' }}>
                    <a href='#' onClick={handleForgotPasswordClick} style={{ fontSize: 9}} >Forgot Password?</a>
                </div>

                <div style={{ textAlign: 'center', paddingBottom: 15, paddingTop: 5 }}>
                    <Button type="submit" style={{ width: 200, borderRadius: 10 }}>Login</Button>
                </div>
            </form>

            <hr style={{ borderColor: 'gray'}} />
        </Form>  
      )

}


