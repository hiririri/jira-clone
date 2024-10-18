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
import React, { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface CreateWorkspacesFormProps {
  onCancel?: () => void;
}

export const CreateWorkspacesForm = ({
  onCancel,
}: CreateWorkspacesFormProps) => {
  const { mutate, isPending } = useCreateWorkspaces();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspacesSchema>>({
    resolver: zodResolver(createWorkspacesSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspacesSchema>) => {
    mutate({ json: values });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imageUrl", file);
    }
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
              <FormField
                control={form.control}
                name={"imageUrl"}
                render={({ field }) => (
                  <div className={"flex flex-col gap-y-2"}>
                    <div className={"flex items-center gap-x-5"}>
                      {field.value ? (
                        <div
                          className={
                            "size-[72px] relative rounded-md overflow-hidden"
                          }
                        >
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            fill
                            className={"object-cover"}
                            alt="Logo"
                          />
                        </div>
                      ) : (
                        <Avatar className={"size-[72px]"}>
                          <AvatarFallback>
                            <ImageIcon
                              className={"size-[36px] text-neutral-400"}
                            ></ImageIcon>
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={"flex flex-col"}>
                        <p className={"text-sm"}>Workspace Icon</p>
                        <p className={"text-sm text-muted-foreground"}>
                          JPG, PNG, SVG, or JPEG. Max 1MB.
                        </p>
                        <input
                          className={"hidden"}
                          type={"file"}
                          accept={".jpgm .png, .jpeg, .svg"}
                          ref={inputRef}
                          onChange={handleImageChange}
                          disabled={isPending}
                        />
                        <Button
                          type={"button"}
                          size={"xs"}
                          variant={"teritary"}
                          onClick={() => inputRef.current?.click()}
                          disabled={isPending}
                          className={"w-fit mt-2"}
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              ></FormField>
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
