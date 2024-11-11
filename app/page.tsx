"use client"

import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type selectLocationType = {
  name: string | null;
  id: number;
  position: string | google.maps.LatLng | google.maps.Place | google.maps.LatLngLiteral;
}

export default function Home() {
  const [userAddress, setUserAddress] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>();
  const [selectedLocation, setSelectedLocation] = useState<selectLocationType>();
  const [loading, setLoading] = useState(false);

  const locations = [
    { id: 1, name: 'Loja 1 - Rua Gen. Flores - Bom Retiro SP', position: { lat: -23.52450081012362, lng: -46.64245413280253 } },
    { id: 2, name: 'Loja 2 - Av. Ipiranga - República SP', position: { lat: -23.543106513921813, lng: -46.641429318655256 } },
    { id: 3, name: 'Loja 3 - Rua Tuiuti - Tatuapé SP', position: { lat: -23.537101263272856, lng: -46.57552208981917 } },
  ];

  const handleUserAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => setUserAddress(e.target.value);

  const traceRoute = () => {

    //if (!userAddress || !selectedLocation) return;
    if (!selectedLocation?.name){
      toast({
        title: "Alerta",
        variant: "destructive",
        description: "A loja não foi selecionada. ",
      })
      return
    }

    if (!userAddress){
      toast({
        title: "Alerta",
        variant: "destructive",
        description: "Não foi possível traçar a rota. Verifique o endereço inserido.",
      })
      return
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Inicializar o DirectionsService para traçar a rota
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: userAddress,
        destination: selectedLocation.position,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) 
        {
          setDirections(result);
        } 
        else {
          alert('Não foi possível traçar a rota. Verifique o endereço inserido.');
        }
      }
    );
  };

  return (
    <div className='w-full mx-3 my-3 gap-4 content-center ...'>
      <LoadScript googleMapsApiKey="AIzaSyBmXL8wzrL5Y_dBfeco202Np8XpjcSKZrY">
      
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={{ lat: -23.55052, lng: -46.633308 }}
        zoom={10}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={loc.position}
            onClick={() => 
              setSelectedLocation(loc)
            }
            title={loc.name}
          />
        ))}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>


      <Card className="w-[650px] my-3 gap-4 content-center ...">
        <CardHeader>
          <CardTitle>Rotas</CardTitle>
          <CardDescription>Selecione a loja, depois coloque o seu endereço e então, clique no botão: Traças Rota</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ljSelecionada">Loja Selecionada:</Label>
                <Input
                id="ljSelecionada"
                type="text"
                placeholder="Loja selecionada"
                value={selectedLocation?.name ?? ''}
                disabled
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="endereco">Endereço:</Label>
                <Input
                  id="endereco"
                  type="text"
                  placeholder="Digite seu endereço"
                  value={userAddress}
                  onChange={handleUserAddressChange}
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          {/* <Button variant="outline">Cancel</Button> */}
          {loading && <Button disabled>Traçar Rota<Loader2 className="animate-spin" /></Button>}
          {!loading && <Button onClick={traceRoute} >Traçar Rota</Button>}
        </CardFooter>
      </Card>

    </LoadScript>
  </div>
  );
}
