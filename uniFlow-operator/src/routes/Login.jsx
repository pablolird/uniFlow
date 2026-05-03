import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "@/components/ui/field";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

// This is just a placeholder schema. Check later with backend what's the actual schema for correct validation
const formSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters.")
    .max(16, "Username must be at most 16 characters."),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters.")
    .max(50, "Password must be at most 50 characters."),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useAuth();
  const [loginError, setLoginError] = useState(null);

  async function onSubmit(data) {
    try {
      await login(data.username, data.password);
    } catch (e) {
      if (e.message === "401") {
        setLoginError("Invalid credentials");
      } else {
        setLoginError("Something went wrong :(");
      }
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-background">
      <div className="text-4xl pb-10 text-foreground font-semibold text-center shrink-0">
        <span className="text-primary">uni</span>Flow
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-username">Username</FieldLabel>
                      <Input
                        {...field}
                        id="form-username"
                        aria-invalid={fieldState.invalid}
                        type="text"
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-password">Password</FieldLabel>
                      <Input
                        {...field}
                        id="form-password"
                        type="password"
                        aria-invalid={fieldState.error}
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" form="login-form" className="w-full">
            Login
          </Button>
          {loginError && (
            <p className="text-destructive text-sm">{loginError}</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
