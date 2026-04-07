import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminMembersPage from "./AdminMembers";
import AdminDepartmentsPage from "./AdminDepartmentsPage";

export default function AdminPeoplePage() {
  const [tab, setTab] = useState("members");

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-[2rem] font-normal text-foreground">People</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Manage learners, admins, and department groups</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="members" className="text-[13px]">Members</TabsTrigger>
          <TabsTrigger value="departments" className="text-[13px]">Departments</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <AdminMembersPage embedded />
        </TabsContent>
        <TabsContent value="departments">
          <AdminDepartmentsPage embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}
