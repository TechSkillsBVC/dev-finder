import { LatLng } from 'react-native-maps';

export default interface User {
    id: number;
    name: string;
    avatar_url: string;
    login: string;
    company: string;
    bio: string | null;
    coordinates: LatLng;
}
