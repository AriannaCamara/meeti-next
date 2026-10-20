import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from 'leaflet';
import type { Marker as TMarker, LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FormError, FormInput, FormLabel } from '@/shared/components/forms';
import { useFormContext } from 'react-hook-form';
import { GeoCodeSchema, MeetiInput } from '../schemas/meetiSchema';
import toast from 'react-hot-toast';

const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=ES&location=";

function CenterMap({ coordinates }: { coordinates: LatLngTuple }) {
  const map = useMap()
  useEffect(() => {
    map.setView([coordinates[0], coordinates[1]]);
  }, [coordinates, map]);
  return null;
}

function ClickHandler({ onPick }: { onPick: (coordinates: LatLngTuple) => void }) {
  useMapEvents({
    click({ latlng }) {
      onPick([latlng.lat, latlng.lng]);
    },
  });
  return null;
}

const markerIcon = new Icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function LocationPicker() {

  const {register, getValues, setValue, formState: {errors} } = useFormContext<MeetiInput>()

  const lat = getValues('location.lat') ?? 40.415339
  const lng = getValues('location.lng') ?? -3.707916

  const [coordinates, setCoordinates] = useState<LatLngTuple>([lat, lng]);

  const markerRef = useRef<TMarker>(null);
  const ZOOM = 16;

  const pickLocation = useCallback(async (positionTuple: LatLngTuple) => {
    setCoordinates(positionTuple);

    try {
      const url = GEOCODE_URL + `${positionTuple[1]},${positionTuple[0]}`
      const data = await (await fetch(url)).json();
      const location = GeoCodeSchema.parse(data.address)

      setValue('location.address', location.LongLabel, { shouldValidate: true })
      setValue('location.city', location.City, { shouldValidate: true })
      setValue('location.country', location.CountryCode, { shouldValidate: true })
      setValue('location.lat', location.InputY, { shouldValidate: true })
      setValue('location.lng', location.InputX, { shouldValidate: true })
    } catch {
      toast.error('No se pudo obtener la dirección de esa ubicación')
    }
  }, [setValue])

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker !== null) {
        const latLng = marker.getLatLng();
        pickLocation([latLng.lat, latLng.lng]);
      }
    },
  }), [pickLocation]);

  return (
    <>
      <MapContainer center={coordinates} zoom={ZOOM} scrollWheelZoom={true} className='h-96 w-full'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={true}
          position={coordinates}
          icon={markerIcon}
          eventHandlers={eventHandlers}
          ref={markerRef}
        >
          <Popup>Dirección aquí</Popup>
        </Marker>

        <ClickHandler onPick={pickLocation} />
        <CenterMap coordinates={coordinates} />
      </MapContainer>

      <FormLabel htmlFor="address">Dirección:</FormLabel>
      <FormInput
        id="address"
        type="text"
        placeholder="Dirección Evento"
        {...register('location.address')}
      />
      {'location' in errors && errors.location?.address && (
        <FormError>{errors.location.address.message}</FormError>
      )}

      <FormLabel htmlFor="city">Ciudad:</FormLabel>
      <FormInput
        id="city"
        type="text"
        placeholder="Ciudad"
        {...register('location.city')}
      />
      {'location' in errors && errors.location?.city && (
        <FormError>{errors.location.city.message}</FormError>
      )}

      <FormLabel htmlFor="country">País:</FormLabel>
      <FormInput
        id="country"
        type="text"
        placeholder="País"
        {...register('location.country')}
      />
      {'location' in errors && errors.location?.country && (
        <FormError>{errors.location.country.message}</FormError>
      )}

    </>
  )
}
