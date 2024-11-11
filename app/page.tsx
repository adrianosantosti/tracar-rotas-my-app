"use client"

import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';

export type selectLocationType = {
  name: string | null;
  id: number;
  position: string | google.maps.LatLng | google.maps.Place | google.maps.LatLngLiteral;
}

export default function Home() {
  const [userAddress, setUserAddress] = useState('');
  const [directions, setDirections] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState<selectLocationType>();
  const [loading, setLoading] = useState(false);

  const locations = [
    { id: 1, name: 'Loja 1 - Teste', position: { lat: -23.52450081012362, lng: -46.64245413280253 } },
    { id: 2, name: 'Loja 2 - Teste', position: { lat: -23.543106513921813, lng: -46.641429318655256 } },
    { id: 3, name: 'Loja 3 - Teste', position: { lat: -23.537101263272856, lng: -46.57552208981917 } },
    // Adicione mais localizações aqui
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
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          alert('Não foi possível traçar a rota. Verifique o endereço inserido.');
        }
      }
    );
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyBmXL8wzrL5Y_dBfeco202Np8XpjcSKZrY">
      <h1>Minhas Lojas</h1>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
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

      <div style={{ marginTop: '20px' }}>
        <div className="grid w-full max-w-lg items-center gap-1.5">
          <Label htmlFor="ljSelecionada">Loja Selecionada:</Label>

          {selectedLocation?.name &&
            <Input
              id="ljSelecionada"
              type="text"
              placeholder="Loja selecionada"
              value={selectedLocation?.name}
              disabled="disabled"
              />
          }

        </div>
      </div>

      <div style={{ marginTop: '20px' }}>

        <div className="grid w-full max-w-lg items-center gap-1.5">
          <Label htmlFor="endereco">Endereço:</Label>
          <Input
            id="endereco"
            type="text"
            placeholder="Digite seu endereço"
            value={userAddress}
            onChange={handleUserAddressChange}
          />

        {loading && <Button disabled>Traçar Rota<Loader2 className="animate-spin" /></Button>}
        {!loading && <Button onClick={traceRoute} >Traçar Rota</Button>}
        
        </div>

        {/* {selectedLocation && <p>Destino: {selectedLocation.name}</p>} */}
      </div>
    </LoadScript>
  </div>
  );
}
