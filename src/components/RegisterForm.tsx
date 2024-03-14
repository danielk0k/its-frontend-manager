"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from 'react-hook-form';
import { z, TypeOf, object, string } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup
  } from "@/components/ui/select"
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
    institution: z.string()
  })

type CreateUserInput = TypeOf<typeof formSchema>;

export function RegisterForm() {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
      },
    })


    useEffect(() => {
      async function fetchData() {
        try {
          const res = await fetch('/api/get-data/get-schools', { method: 'GET' })
          const data = await res.json()
          setData(data)
          setLoading(false)
        } catch (e) {
          console.error(e)
        }
      };
      fetchData();

    }, []);

    if (!data) return <p>Loading Register Page...</p>
    const schools: School[] = data.school_ids.map((school: School) => ({
        id: school.id,
        name: school.name,
    }));

    // if (data) return <p>{schools[0].name}</p> // this is just to check if the data is being fetched

    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
      } = form;

      const onSubmitHandler: SubmitHandler<CreateUserInput> = async (values) => {
        try {

          setSubmitting(true);
          const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          setSubmitting(false);
          if (!res.ok) {
            const message = (await res.json()).message;
            return;
          }

          signIn(undefined, { callbackUrl: '/' });
        } catch (error: any) {
          setSubmitting(false);
        }
      };

    return (
        <Form {...form}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 15 }}>
                <p style={{ fontWeight: 'bold', fontSize: 20}}> Account Registration</p>
            </div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <FormField
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

                <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="🏫 Select Institution" {...register('institution')}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Schools</SelectLabel>
                            {schools.map((school) => (
                              <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div style={{ textAlign: 'center', paddingBottom: 15, paddingTop: 20 }}>
                    <Button
                        type="submit"
                        style={{ width: 200, borderRadius: 10 }}>
                            Register

                    </Button>
                </div>
            </form>

            <hr style={{ borderColor: 'gray'}} />
        </Form>
      )

}


