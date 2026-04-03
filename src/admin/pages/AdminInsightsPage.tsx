import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminAnalyticsPage from "./AdminAnalyticsPage";
import AdminOutcomesPage from "./AdminOutcomesPage";

export default function AdminInsightsPage() {
  const [tab, setTab] = useState("analytics");

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-[2rem] font-normal text-foreground">Insights</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Analytics, mastery outcomes, and knowledge gaps</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="analytics" className="text-[13px]">Analytics</TabsTrigger>
          <TabsTrigger value="outcomes" className="text-[13px]">Outcomes</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics">
          <div className="-m-6 lg:-m-8"><AdminAnalyticsPage /></div>
        </TabsContent>
        <TabsContent value="outcomes">
          <div className="-m-6 lg:-m-8"><AdminOutcomesPage /></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
