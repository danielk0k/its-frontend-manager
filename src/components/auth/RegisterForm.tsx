"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z, TypeOf } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
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
import { School } from "@prisma/client";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  institution: z.string(),
});

type CreateUserInput = TypeOf<typeof formSchema>;

export function RegisterForm({ schools }: { schools: School[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      institution: "",
    },
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmitHandler: SubmitHandler<CreateUserInput> = async (values) => {
    try {
      const res = await fetch("/api/register", {
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
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <Form {...form}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 15,
        }}
      >
        <p style={{ fontWeight: "bold", fontSize: 20 }}>
          {" "}
          Account Registration
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="👤 Type your email"
                  {...register("email")}
                />
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
                <Input
                  type="password"
                  placeholder="🔒 Type your password"
                  {...register("password")}
                />
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
                    <SelectValue
                      placeholder="🏫 Select Institution"
                      {...register("institution")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Schools</SelectLabel>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div style={{ textAlign: "center", paddingBottom: 15, paddingTop: 20 }}>
          <Button type="submit" style={{ width: 200, borderRadius: 10 }}>
            Register
          </Button>
        </div>
      </form>
      <hr style={{ borderColor: "gray" }} />
    </Form>
  );
}
