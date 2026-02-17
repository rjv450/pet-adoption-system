"use client";

import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PetsTab from "@/components/admin/PetsTab";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return <div className="text-center py-10">Loading admin dashboard...</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <Tabs defaultValue="applications">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="pets">Manage Pets</TabsTrigger>
                </TabsList>
                <TabsContent value="applications">
                    <ApplicationsTab />
                </TabsContent>
                <TabsContent value="pets">
                    <PetsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
