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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash, Plus } from "lucide-react";

export default function PetsTab() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingPet, setEditingPet] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        species: "",
        breed: "",
        age: "",
        description: "",
        status: "available",
        image: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fetchPets = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/pets", {
                params: { page, limit: 10 }
            });
            setPets(data.pets);
            setTotalPages(data.pages || 1);
            setTotal(data.total || data.pets?.length || 0);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch pets");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, [page]);

    const handleOpen = (pet?: any) => {
        if (pet) {
            setEditingPet(pet);
            setFormData({
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                age: pet.age,
                description: pet.description,
                status: pet.status,
                image: pet.image || ""
            });
            setImageFile(null);
        } else {
            setEditingPet(null);
            setFormData({
                name: "",
                species: "",
                breed: "",
                age: "",
                description: "",
                status: "available",
                image: ""
            });
            setImageFile(null);
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('species', formData.species);
            submitData.append('breed', formData.breed);
            submitData.append('age', formData.age);
            submitData.append('description', formData.description);
            submitData.append('status', formData.status);
            
            if (imageFile) {
                submitData.append('image', imageFile);
            } else if (formData.image && !formData.image.startsWith('http') && !formData.image.startsWith('/')) {
                submitData.append('image', formData.image);
            }

            if (editingPet) {
                await api.put(`/pets/${editingPet._id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Pet updated successfully");
            } else {
                await api.post("/pets", submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Pet created successfully");
            }
            setOpen(false);
            setImageFile(null);
            setEditingPet(null);
            fetchPets();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this pet?")) return;
        try {
            await api.delete(`/pets/${id}`);
            toast.success("Pet deleted");
            fetchPets();
        } catch (error) {
            toast.error("Failed to delete pet");
        }
    };

    if (loading) return <div>Loading pets...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Pets</h2>
                <Button onClick={() => handleOpen()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Pet
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Species</TableHead>
                            <TableHead>Breed</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pets.map((pet: any) => (
                            <TableRow key={pet._id}>
                                <TableCell className="font-medium">{pet.name}</TableCell>
                                <TableCell>{pet.species}</TableCell>
                                <TableCell>{pet.breed}</TableCell>
                                <TableCell>{pet.age}</TableCell>
                                <TableCell>
                                    <Badge variant={pet.status === 'available' ? 'default' : 'secondary'}>
                                        {pet.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="icon" variant="ghost" onClick={() => handleOpen(pet)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(pet._id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {pets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">No pets found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} pets
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingPet ? "Edit Pet" : "Add New Pet"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="species" className="text-right">Species</Label>
                            <Input id="species" value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="breed" className="text-right">Breed</Label>
                            <Input id="breed" value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="age" className="text-right">Age</Label>
                            <Input id="age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="adopted">Adopted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="col-span-3" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">Image</Label>
                            <div className="col-span-3 space-y-2">
                                <Input 
                                    id="image-file" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            setFormData({ ...formData, image: '' });
                                        }
                                    }}
                                />
                                <Input 
                                    id="image-url" 
                                    placeholder="Or enter image URL" 
                                    value={formData.image} 
                                    onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        setImageFile(null);
                                    }}
                                />
                                {imageFile && (
                                    <p className="text-sm text-muted-foreground">Selected: {imageFile.name}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>{editingPet ? "Update" : "Create"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
