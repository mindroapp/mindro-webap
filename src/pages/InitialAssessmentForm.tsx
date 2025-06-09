
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { usePatientStore } from "@/stores/patientStore";
import { InitialRecord } from "@/stores/patientStore";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const InitialAssessmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addInitialAssessment, selectedPatient, fetchPatient } = usePatientStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InitialRecord>({
    defaultValues: {
      reasonForConsultation: "",
      familyHistory: "",
      medicalHistory: "",
      previousTreatment: "",
      mentalStatusExam: "",
      initialDiagnosis: "",
      treatmentPlan: ""
    }
  });

  const onSubmit = async (data: InitialRecord) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await addInitialAssessment(id, data);
      
      toast({
        title: "Initial assessment created",
        description: "The initial assessment has been created successfully.",
      });
      
      navigate(`/patients/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create initial assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate(`/patients/${id}`)}>
            <ArrowLeft size={16} className="mr-1" /> Back to Patient
          </Button>
          <h1 className="text-2xl font-bold">Create Initial Assessment</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Initial Assessment</CardTitle>
            <CardDescription>
              Document the patient's initial assessment information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="reasonForConsultation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Consultation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the primary reason the patient is seeking therapy"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="familyHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Family History</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Relevant family history"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Relevant medical history"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="previousTreatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Treatment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any previous psychological treatment"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mentalStatusExam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mental Status Exam</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Results of mental status examination"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="initialDiagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Diagnosis</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Preliminary diagnosis (if applicable)"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="treatmentPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Plan</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Proposed treatment approach"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <CardFooter className="flex justify-end pt-6 px-0">
                  <Button type="button" variant="outline" className="mr-2" onClick={() => navigate(`/patients/${id}`)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Assessment"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InitialAssessmentForm;
