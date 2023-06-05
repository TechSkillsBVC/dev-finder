import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Retrieves data from a network request and stores it in the cache.
 * If the request fails, retrieves the data from the cache instead.
 * @param key - The key to use for storing the data in the cache.
 * @param request - The network request to retrieve the data.
 * @returns A promise that resolves with the retrieved data.
 */
export async function getFromNetworkFirst<T>(key: string, request: Promise<T>): Promise<T> {
    try {
        const response = await request;
        setInStorage(key, response);
        return response;
    } catch (e) {
        return getFromStorage<T>(key);
    }
}

/**
 * Stores a value in the cache using the provided key.
 * @param key - The key to use for storing the value in the cache.
 * @param value - The value to store in the cache.
 * @returns A promise that resolves when the value has been stored in the cache.
 */
export function setInStorage(key: string, value: any): Promise<void> {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
}

/**
 * Removes a value from the cache using the provided key.
 * @param key - The key to use for removing the value from the cache.
 * @returns A promise that resolves when the value has been removed from the cache.
 */
export function removeFromStorage(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
}

/**
 * Retrieves a value from the cache using the provided key.
 * @param key - The key to use for retrieving the value from the cache.
 * @returns A promise that resolves with the retrieved value, or rejects with an error message if the key is not found in the cache.
 */
export async function getFromStorage<T>(key: string): Promise<T> {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
}
