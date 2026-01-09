'use client';

import React, { useRef, useState } from 'react';
import { useField } from '@tanstack/react-form';
import { useFormContext } from '../form-context';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { cn, useLocation } from '@/lib';
import { useCSSVariable } from 'uniwind';
import { Modal, useModal } from '../../modal';
import MapView, {
  PROVIDER_GOOGLE,
  type Region,
  Marker,
} from 'react-native-maps';
import * as Icons from '@/icons';

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

  const [addressInput, setAddressInput] = useState('');
  const [useMap, setUseMap] = useState(false);

  const value = field.state.value as LocationValue | undefined;

  const onRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
  };

  const handleConfirm = () => {
    const locationValue: LocationValue = {
      address: useMap
        ? `${currentRegion.latitude.toFixed(6)}, ${currentRegion.longitude.toFixed(6)}`
        : addressInput,
      latitude: useMap ? currentRegion.latitude : 0,
      longitude: useMap ? currentRegion.longitude : 0,
    };
    field.handleChange(locationValue);
    // Reset state
    setAddressInput('');
    setUseMap(false);
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
    }
  };

  const handleClear = () => {
    field.handleChange(undefined);
    setAddressInput('');
    setUseMap(false);
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

      <Modal ref={ref} snapPoints={['70%', '80%']} detached>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          className="p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-primary text-lg font-semibold">
              Select Location
            </Text>
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

          {/* Address Input */}
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Enter Address
            </Text>
            <TextInput
              className="border-primary/10 bg-background-secondary rounded-xl border p-3 text-sm text-gray-900"
              value={addressInput}
              onChangeText={setAddressInput}
              placeholder="e.g., 123 Main Street, City, Country"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              onFocus={() => setUseMap(false)}
            />
          </View>

          {/* Divider */}
          <View className="mb-3 flex-row items-center gap-2">
            <View className="bg-secondary/10 h-px flex-1" />
            <Text className="text-secondary text-xs font-medium uppercase">
              Or select on map
            </Text>
            <View className="bg-secondary/10 h-px flex-1" />
          </View>

          {/* Toggle Map Button */}
          <TouchableOpacity
            onPress={() => setUseMap(!useMap)}
            className={cn(
              'mb-3 flex-row items-center justify-center rounded-xl border p-3',
              useMap
                ? 'border-primary bg-primary/10'
                : 'border-secondary/10 bg-background-secondary',
            )}>
            <Icons.Icon
              icon={Icons.Hugeicons.MapPinFreeIcons}
              size={18}
              strokeWidth={2}
              color={useMap ? primary : '#9ca3af'}
            />
            <Text
              className={cn(
                'ml-2 text-sm font-medium',
                useMap ? 'text-primary' : 'text-gray-500',
              )}>
              {useMap ? 'Map Enabled' : 'Enable Map Selection'}
            </Text>
          </TouchableOpacity>

          {/* Map View */}
          {useMap && (
            <View className="relative mb-4 h-64 overflow-hidden rounded-xl">
              <MapView
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
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
                  className="bg-background-secondary size-8 items-center justify-center rounded-full"
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
          )}

          {/* Selected Coordinates Info (when map is enabled) */}
          {useMap && (
            <View className="border-secondary/10 bg-background-secondary rounded-xl border p-3">
              <Text className="mb-1 text-xs text-gray-500">
                Selected Coordinates
              </Text>
              <Text className="text-sm font-medium text-gray-900">
                {currentRegion.latitude.toFixed(6)},{' '}
                {currentRegion.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          {/* Helper Text */}
          <View className="bg-primary/5 mt-4 rounded-xl p-3">
            <View className="mb-1 flex-row items-center gap-2">
              <Icons.Icon
                icon={Icons.Hugeicons.InformationCircleFreeIcons}
                size={16}
                strokeWidth={2}
                color={primary}
              />
              <Text className="text-primary text-sm font-semibold">Tip</Text>
            </View>
            <Text className="text-xs leading-relaxed text-gray-600">
              {useMap
                ? 'Drag the map to position the pin. The coordinates will be saved as your location.'
                : 'Type your address above or enable map selection to pick a location on the map.'}
            </Text>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
