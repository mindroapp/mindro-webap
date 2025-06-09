
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FinancialSummary from "@/components/financial/FinancialSummary";
import PaymentList from "@/components/financial/PaymentList";
import PackageList from "@/components/financial/PackageList";
import PaymentModal from "@/components/financial/PaymentModal";
import PackageModal from "@/components/financial/PackageModal";
import ReportsDashboard from "@/components/financial/ReportsDashboard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";

const FinancialPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { patients } = usePatientStore();
  
  const handleOpenPaymentModal = () => {
    if (patients.length > 0) {
      setSelectedPatientId(patients[0].id);
      setIsPaymentModalOpen(true);
    }
  };
  
  const handleOpenPackageModal = () => {
    if (patients.length > 0) {
      setSelectedPatientId(patients[0].id);
      setIsPackageModalOpen(true);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <div className="space-x-2">
            <Button onClick={handleOpenPackageModal} className="bg-indigo-700 hover:bg-indigo-800">
              <Plus size={16} className="mr-2" /> Novo Pacote
            </Button>
            <Button onClick={handleOpenPaymentModal} className="bg-indigo-700 hover:bg-indigo-800">
              <Plus size={16} className="mr-2" /> Novo Pagamento
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="packages">Pacotes</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <FinancialSummary />
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <Button onClick={handleOpenPaymentModal} className="bg-indigo-700 hover:bg-indigo-800">
                  <Plus size={16} className="mr-2" /> Novo Pagamento
                </Button>
              </CardHeader>
              <CardContent>
                <PaymentList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="packages" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Pacotes de Sessões</CardTitle>
                <Button onClick={handleOpenPackageModal} className="bg-indigo-700 hover:bg-indigo-800">
                  <Plus size={16} className="mr-2" /> Novo Pacote
                </Button>
              </CardHeader>
              <CardContent>
                <PackageList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios e Indicadores</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {selectedPatientId && (
          <>
            <PaymentModal
              patientId={selectedPatientId}
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
            />
            
            <PackageModal
              patientId={selectedPatientId}
              isOpen={isPackageModalOpen}
              onClose={() => setIsPackageModalOpen(false)}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FinancialPage;
