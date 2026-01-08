'use client';

import React, { useRef, useState } from 'react';
import { useField } from '@tanstack/react-form';
import { useFormContext } from '../form-context';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { cn, useLocation } from '@/lib';
import { useCSSVariable } from 'uniwind';
import { Modal, useModal } from '../../modal';
import MapView, {
  PROVIDER_GOOGLE,
  type Region,
  Marker,
} from 'react-native-maps';
import * as Icons from '@/icons';
import { ScrollView } from 'react-native-gesture-handler';

type LocationValue = {
  address: string;
  latitude: number;
  longitude: number;
};

type FieldLocationSelectorProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function FieldLocationSelector({
  name,
  label,
  placeholder = 'Select location on map',
  className,
  disabled = false,
}: FieldLocationSelectorProps) {
  const form = useFormContext();
  const primary = useCSSVariable('--color-primary') as string;
  const mapRef = useRef<MapView>(null);

  const { ref, present, dismiss } = useModal();

  const {
    location: { latitude, longitude },
  } = useLocation();

  const field = useField({
    form,
    name,
  });

  const [currentRegion, setCurrentRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const value = field.state.value as LocationValue | undefined;

  const onRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
  };

  const handleConfirm = () => {
    const locationValue: LocationValue = {
      address: `${currentRegion.latitude.toFixed(6)}, ${currentRegion.longitude.toFixed(6)}`,
      latitude: currentRegion.latitude,
      longitude: currentRegion.longitude,
    };
    field.handleChange(locationValue);
    dismiss();
  };

  const goToMyLocation = () => {
    if (latitude && longitude && mapRef.current) {
      const region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region, 500);
      setCurrentRegion(region);
      field.handleChange({
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        latitude,
        longitude,
      });
    }
  };

  const handleClear = () => {
    field.handleChange(undefined);
  };

  const displayValue = value?.address || '';

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <View className="flex w-full flex-col">
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      )}

      <TouchableOpacity
        onPress={present}
        disabled={disabled}
        className={cn(
          'bg-background-secondary border-primary/10 flex-row items-center rounded-xl border px-1.5',
          hasError && 'border-red-500',
          disabled && 'opacity-50',
          className,
        )}
        activeOpacity={0.7}>
        <Icons.Icon
          icon={Icons.Hugeicons.Location01FreeIcons}
          size={20}
          strokeWidth={2}
          color={primary}
        />
        <TextInput
          className="flex-1 text-sm text-gray-900"
          value={displayValue}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          editable={false}
          pointerEvents="none"
        />
        {displayValue ? (
          <TouchableOpacity onPress={handleClear} hitSlop={10}>
            <Icons.Icon
              icon={Icons.Hugeicons.CancelCircleFreeIcons}
              size={20}
              strokeWidth={1.5}
              color={primary}
            />
          </TouchableOpacity>
        ) : (
          <Icons.Icon
            icon={Icons.Hugeicons.ArrowRight01FreeIcons}
            size={16}
            strokeWidth={2}
            color={primary}
          />
        )}
      </TouchableOpacity>

      {hasError && (
        <Text className="mt-0.5 text-xs text-red-500">
          {field.state.meta.errors
            .map((err: any) => err?.message ?? String(err))
            .join(', ')}
        </Text>
      )}

      <Modal ref={ref} snapPoints={['60%']} detached>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          className="p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-primary text-sm">Select Location</Text>
            <TouchableOpacity
              onPress={handleConfirm}
              className="bg-primary/10 border-primary flex-row items-center gap-2 rounded-xl border p-1.5 px-3">
              <Text className="text-primary text-sm">Save</Text>
              <Icons.Icon
                icon={Icons.Hugeicons.LocationCheck01Icon}
                size={18}
                strokeWidth={1.5}
                color={primary}
              />
            </TouchableOpacity>
          </View>

          <View className="relative mb-4 h-[350px] overflow-hidden rounded-xl">
            <MapView
              ref={mapRef}
              style={{ width: '100%', height: '100%' }}
              provider={PROVIDER_GOOGLE}
              initialRegion={currentRegion}
              onRegionChangeComplete={onRegionChangeComplete}
              className="rounded-xl">
              {/* <Marker
                coordinate={{
                  latitude: currentRegion.latitude,
                  longitude: currentRegion.longitude,
                }}
              /> */}
            </MapView>
            <View
              className="absolute top-1/2 left-1/2 z-10 items-center justify-center"
              style={{
                marginLeft: -18,
                marginTop: -36,
              }}>
              <Icons.Icon
                icon={Icons.Hugeicons.PinLocation02FreeIcons}
                size={32}
                strokeWidth={2}
                color={primary}
              />
              <View
                className="absolute -bottom-1 size-5 rounded-full bg-black opacity-20"
                style={{
                  transform: [{ scaleX: 1.2 }, { scaleY: 0.4 }],
                }}
              />
            </View>
            <View className="absolute bottom-3 w-full flex-row justify-between px-2">
              <TouchableOpacity
                className="bg-primary/10 border-primary size-8 items-center justify-center rounded-full border"
                onPress={goToMyLocation}>
                <Icons.Icon
                  icon={Icons.Hugeicons.Location03FreeIcons}
                  size={24}
                  strokeWidth={1.5}
                  color={primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="border-secondary/10 bg-background-secondary rounded-xl border p-2">
            <Text className="mb-1 text-xs text-gray-500">
              Selected Location
            </Text>
            <Text className="text-sm font-medium text-gray-900">
              {currentRegion.latitude.toFixed(6)},{' '}
              {currentRegion.longitude.toFixed(6)}
            </Text>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
