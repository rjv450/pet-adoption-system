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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function ApplicationsTab() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/applications", {
                params: { page, limit: 10 }
            });
            // Handle both paginated and non-paginated responses
            if (Array.isArray(data)) {
                setApplications(data);
                setTotalPages(1);
                setTotal(data.length);
            } else {
                setApplications(data.applications || []);
                setTotalPages(data.pages || 1);
                setTotal(data.total || 0);
            }
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch applications");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [page]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/applications/${id}`, { status });
            toast.success(`Application ${status}`);
            fetchApplications();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div>Loading applications...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Adoption Applications</h2>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Pet</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app: any) => (
                            <TableRow key={app._id}>
                                <TableCell>{app.user?.name}</TableCell>
                                <TableCell>{app.user?.email}</TableCell>
                                <TableCell>{app.pet?.name}</TableCell>
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
                                <TableCell className="text-right space-x-2">
                                    {app.status === 'pending' && (
                                        <>
                                            <Button size="icon" variant="outline" onClick={() => updateStatus(app._id, 'approved')} title="Approve">
                                                <Check className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button size="icon" variant="outline" onClick={() => updateStatus(app._id, 'rejected')} title="Reject">
                                                <X className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {applications.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">No applications found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} applications
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
