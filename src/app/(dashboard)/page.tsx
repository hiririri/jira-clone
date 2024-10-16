import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import CreateWorkspacesForm from "@/features/workspaces/components/create-workspaces-form";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div>
      <CreateWorkspacesForm />
    </div>
  );
}
