import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    status: 'available' | 'pending' | 'adopted';
    image: string;
}

interface PetCardProps {
    pet: Pet;
}

const PetCard = ({ pet }: PetCardProps) => {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-square relative">
                {/* Placeholder for real image or use a default */}
                <Image
                    src={
                        pet.image === 'no-photo.jpg' || !pet.image
                            ? 'https://placehold.co/400?text=No+Image'
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
                <Badge className="absolute top-2 right-2" variant={pet.status === 'available' ? 'default' : 'secondary'}>
                    {pet.status}
                </Badge>
            </div>
            <CardHeader>
                <CardTitle className="text-xl flex justify-between items-center">
                    {pet.name}
                    <span className="text-sm font-normal text-muted-foreground">{pet.species}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Breed:</span> {pet.breed}</p>
                    <p><span className="font-semibold">Age:</span> {pet.age} years</p>
                </div>
            </CardContent>
            <CardFooter>
                <Link href={`/pets/${pet._id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default PetCard;
