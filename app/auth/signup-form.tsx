'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  useQueryState,
  useSearchParams,
  useTransition,
  useForm,
} from '@/hooks';
import { MIN_PASSWORD_LENGTH } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {} from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signup } from '@/services/auth';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z
  .object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    }),
    confirmPassword: z.string().min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Inputs = z.infer<typeof formSchema>;

export const SignupForm = () => {
  const searchParams = useSearchParams();

  const [, setAuthMode] = useQueryState('mode');

  const callbackUrl = searchParams.get('callbackUrl');

  const [loading, startTransition] = useTransition();

  const defaultValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (inputs: Inputs) => {
    await signup(inputs);

    startTransition(() => {
      signIn('credentials', {
        email: inputs.email,
        password: inputs.password,
        callbackUrl: callbackUrl ?? '/dashboard',
      });
      toast.success('Sign Up Successfully!');
    });
  };

  return (
    <Form {...form}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password below
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className=" space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
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
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className=" space-y-2">
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Sign Up
          </Button>

          <Button
            disabled={loading}
            className="ml-auto w-full"
            variant="ghost"
            onClick={() => setAuthMode(null)}
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};
