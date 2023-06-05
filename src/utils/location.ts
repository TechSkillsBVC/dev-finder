import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';

import { LatLng } from 'react-native-maps';

export const DEFAULT_LOCATION: LatLng = { latitude: 51.03, longitude: -114.093 };

export async function tryGetCurrentPosition(): Promise<LatLng> {
    const { status } = await requestForegroundPermissionsAsync();

    if (status === 'granted') {
        const { coords } = await getCurrentPositionAsync();
        const { latitude, longitude } = coords;
        return { latitude, longitude };
    } else {
        throw Error('Permission has not been granted.');
    }
}
