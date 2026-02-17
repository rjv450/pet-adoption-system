"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import PetCard from '@/components/pets/PetCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PetsPage() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [species, setSpecies] = useState('all');
    const [breed, setBreed] = useState('all');
    const [age, setAge] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPets = async () => {
        setLoading(true);
        try {
            const params: any = { page };
            if (search) params.search = search;
            if (species && species !== 'all') params.species = species;
            if (breed && breed !== 'all') params.breed = breed;
            if (age) params.age = parseInt(age);

            const { data } = await api.get('/pets', { params });
            setPets(data.pets);
            setTotalPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, [page, species, breed, age]); // Refetch when filters change

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchPets();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <h1 className="text-3xl font-bold">Available Pets</h1>

                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search breed or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-[300px]"
                    />
                    <Button type="submit">Search</Button>
                </form>

                <div className="flex gap-2 flex-wrap">
                    <Select value={species} onValueChange={(val) => { setSpecies(val); setPage(1); }}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Species" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Species</SelectItem>
                            <SelectItem value="Dog">Dog</SelectItem>
                            <SelectItem value="Cat">Cat</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        placeholder="Breed filter..."
                        value={breed === 'all' ? '' : breed}
                        onChange={(e) => { setBreed(e.target.value || 'all'); setPage(1); }}
                        className="w-[150px]"
                    />
                    <Input
                        type="number"
                        placeholder="Age filter..."
                        value={age}
                        onChange={(e) => { setAge(e.target.value); setPage(1); }}
                        className="w-[100px]"
                        min="0"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading pets...</div>
            ) : (
                <>
                    {pets.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No pets found matching your criteria.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {pets.map((pet: any) => (
                                <PetCard key={pet._id} pet={pet} />
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4">Page {page} of {totalPages}</span>
                        <Button
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
