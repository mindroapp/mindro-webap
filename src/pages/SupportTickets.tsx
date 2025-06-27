
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SupportTicketsFilter from "@/components/SupportTicketsFilter";

const SupportTickets: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Suporte Técnico</h2>
        </div>

        <SupportTicketsFilter />
      </div>
    </DashboardLayout>
  );
};

export default SupportTickets;
