"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function PetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [pet, setPet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const { data } = await api.get(`/pets/${id}`);
                setPet(data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load pet details");
                setLoading(false);
            }
        };
        fetchPet();
    }, [id]);

    const handleAdopt = async () => {
        if (!message.trim()) {
            toast.error("Please provide a message explaining why you want to adopt.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/applications", {
                petId: pet._id,
                message,
            });
            toast.success("Application submitted successfully!");
            setOpen(false);
            setMessage("");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!pet) return <div className="text-center py-10">Pet not found</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {/* Placeholder for real image */}
                    <Image
                        src={
                            pet.image === 'no-photo.jpg' || !pet.image
                                ? 'https://placehold.co/600?text=No+Image'
                                : pet.image.startsWith('http') || pet.image.startsWith('/')
                                ? pet.image.startsWith('/uploads') 
                                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${pet.image}`
                                    : pet.image
                                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${pet.image}`
                        }
                        alt={pet.name}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-bold">{pet.name}</h1>
                            <Badge variant={pet.status === 'available' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                                {pet.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-2 text-lg">{pet.species} • {pet.breed}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-secondary rounded-lg">
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="text-xl font-semibold">{pet.age} years</p>
                        </div>
                        {/* Add more stats if available */}
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">About {pet.name}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {pet.description}
                        </p>
                    </div>

                    {pet.status === 'available' && (
                        <div className="pt-4">
                            {user ? (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" className="w-full text-lg">Adopt {pet.name}</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Adopt {pet.name}</DialogTitle>
                                            <DialogDescription>
                                                Tell us why you would be a great owner for {pet.name}.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="message">Your Message</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="I have a large backyard and..."
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    rows={5}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                            <Button onClick={handleAdopt} disabled={submitting}>
                                                {submitting ? "Submitting..." : "Submit Application"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Button size="lg" className="w-full text-lg" onClick={() => router.push(`/login?redirect=/pets/${id}`)}>
                                    Login to Adopt
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
