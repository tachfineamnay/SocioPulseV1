interface GeocodingResult {
    longitude: number;
    latitude: number;
    label: string;
    city: string;
    postalCode: string;
    confidence: number;
}
export declare class GeocodingService {
    private readonly logger;
    private readonly baseUrl;
    geocodeAddress(address: string): Promise<GeocodingResult | null>;
    geocodeCityPostalCode(city: string, postalCode: string): Promise<GeocodingResult | null>;
    reverseGeocode(longitude: number, latitude: number): Promise<string | null>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    private toRad;
}
export {};
