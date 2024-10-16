"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/components/workspace-avatar";

export const WorkspaceSwitcher = () => {
  const { data: workspaces } = useGetWorkspaces();

  return (
    <div className={"flex flex-col gap-y-2"}>
      <div className={"flex items-center justify-between"}>
        <p className={"text-xs uppercase text-neutral-500"}>Workspaces</p>
        <RiAddCircleFill
          className={
            "size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          }
        />
      </div>
      <Select>
        <SelectTrigger className={"w-full bg-neutral-200 font-medium p-1"}>
          <SelectValue placeholder={"No workspace selected"} />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem value={workspace.$id} key={workspace.$id}>
              <div
                className={"flex justify-center items-center gap-3 font-medium"}
              >
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                  className={"size-8"}
                />
                <span className={"truncate"}>{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
