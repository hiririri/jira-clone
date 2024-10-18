"use client";

import { useForm } from "react-hook-form";
import { createWorkspacesSchema } from "@/features/workspaces/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaces } from "@/features/workspaces/api/use-create-workspaces";

interface CreateWorkspacesFormProps {
  onCancel?: () => void;
}

export const CreateWorkspacesForm = ({
  onCancel,
}: CreateWorkspacesFormProps) => {
  const { mutate, isPending } = useCreateWorkspaces();
  const form = useForm<z.infer<typeof createWorkspacesSchema>>({
    resolver: zodResolver(createWorkspacesSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspacesSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className={"w-full h-full border-none shadow-none"}>
      <CardHeader className={"flex p-7"}>
        <CardTitle className={"text-xl font-bold"}>
          Create a new Workspace
        </CardTitle>
      </CardHeader>
      <div className={"px-7"}>
        <DottedSeparator />
      </div>
      <CardContent className={"p-7"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={"flex flex-col gap-y-4"}>
              <FormField
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={"Enter workspace name"}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className={"py-7"} />
            <div className={"flex items-center justify-between"}>
              <Button
                type={"button"}
                size={"lg"}
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type={"submit"} size={"lg"} disabled={isPending}>
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateWorkspacesForm;
