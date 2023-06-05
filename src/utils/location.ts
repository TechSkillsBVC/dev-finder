import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';

import { LatLng } from 'react-native-maps';

export const DEFAULT_LOCATION: LatLng = { latitude: 51.03, longitude: -114.093 };

/**
 * Tries to get the current position of the device.
 * If the user has granted permission, it returns the current position as a LatLng object.
 * If the user has not granted permission, it throws an error.
 * @returns A promise that resolves to a LatLng object representing the current position.
 * @throws An error if the user has not granted permission.
 */
export async function tryGetCurrentPosition(): Promise<LatLng> {
    // Request foreground location permissions from the user
    const { status } = await requestForegroundPermissionsAsync();

    // If the user has granted permission, get the current position
    if (status === 'granted') {
        const { coords } = await getCurrentPositionAsync();
        const { latitude, longitude } = coords;
        return { latitude, longitude };
    } else {
        // If the user has not granted permission, throw an error
        throw Error('Permission has not been granted.');
    }
}
