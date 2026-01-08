'use client';

import React, { useRef, useState } from 'react';
import { useField } from '@tanstack/react-form';
import { useFormContext } from '../form-context';
import { TextInput, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cn } from '@/lib';
import { useCSSVariable } from 'uniwind';
import { Modal, useModal } from '../../modal';
import MapView, { PROVIDER_GOOGLE, type Region, Marker } from 'react-native-maps';

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
          'bg-background-secondary border-primary/10 flex-row items-center rounded-xl border p-3',
          hasError && 'border-red-500',
          disabled && 'opacity-50',
          className,
        )}
        activeOpacity={0.7}>
        <MaterialIcons
          name="location-on"
          size={20}
          color={hasError ? '#ef4444' : primary}
          style={{ marginRight: 8 }}
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
            <MaterialIcons name="cancel" size={20} color={primary} />
          </TouchableOpacity>
        ) : (
          <MaterialIcons name="arrow-drop-down" size={24} color={primary} />
        )}
      </TouchableOpacity>

      {hasError && (
        <Text className="mt-0.5 text-xs text-red-500">
          {field.state.meta.errors
            .map((err: any) => err?.message ?? String(err))
            .join(', ')}
        </Text>
      )}

      <Modal ref={ref} snapPoints={['70%']}>
        <View className="p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Select Location
            </Text>
            <TouchableOpacity onPress={dismiss}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="relative mb-4 overflow-hidden rounded-xl">
            <MapView
              ref={mapRef}
              style={{ width: '100%', height: 350 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={currentRegion}
              onRegionChangeComplete={onRegionChangeComplete}
              className="rounded-xl">
              <Marker
                coordinate={{
                  latitude: currentRegion.latitude,
                  longitude: currentRegion.longitude,
                }}
              />
            </MapView>

            {/* Center Pin */}
            <View
              className="absolute left-1/2 top-1/2 z-10 items-center justify-center"
              style={{ marginLeft: -18, marginTop: -36 }}>
              <MaterialIcons name="location-on" size={36} color={primary} />
              <View
                className="absolute -bottom-1 h-5 w-5 rounded-full bg-black opacity-20"
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 0.4 }] }}
              />
            </View>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-3">
            <Text className="mb-1 text-xs text-gray-500">Selected Location</Text>
            <Text className="text-sm font-medium text-gray-900">
              {currentRegion.latitude.toFixed(6)},{' '}
              {currentRegion.longitude.toFixed(6)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleConfirm}
            className="mt-4 rounded-xl bg-primary px-4 py-3">
            <Text className="text-center text-sm font-bold text-white">
              Confirm Location
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
