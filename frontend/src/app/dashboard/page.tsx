"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function DashboardPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get("/applications");
                // Handle both paginated and non-paginated responses
                if (Array.isArray(data)) {
                    setApplications(data);
                } else {
                    setApplications(data.applications || []);
                }
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch applications");
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <h1 className="text-3xl font-bold">My Dashboard</h1>

            <Card>
                <CardHeader>
                    <CardTitle>My Adoption Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    {applications.length === 0 ? (
                        <p className="text-muted-foreground">You haven't submitted any applications yet.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pet</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((app: any) => (
                                    <TableRow key={app._id}>
                                        <TableCell className="font-medium">{app.pet?.name || 'Unknown Pet'}</TableCell>
                                        <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                app.status === 'approved' ? 'default' :
                                                    app.status === 'rejected' ? 'destructive' : 'secondary'
                                            }>
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={app.message}>
                                            {app.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
