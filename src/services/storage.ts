import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getFromNetworkFirst<T>(key: string, request: Promise<T>): Promise<T> {
    try {
        const response = await request;
        setInStorage(key, response);
        return response;
    } catch (e) {
        return getFromStorage<T>(key);
    }
}

export function setInStorage(key: string, value: any) {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
}

export function removeFromStorage(key: string) {
    return AsyncStorage.removeItem(key);
}

export async function getFromStorage<T>(key: string): Promise<T> {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
}
