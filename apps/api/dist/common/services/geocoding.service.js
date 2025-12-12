"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GeocodingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
let GeocodingService = GeocodingService_1 = class GeocodingService {
    constructor() {
        this.logger = new common_1.Logger(GeocodingService_1.name);
        this.baseUrl = 'https://api-adresse.data.gouv.fr';
    }
    async geocodeAddress(address) {
        if (!address || address.trim().length < 3) {
            this.logger.warn('Address too short for geocoding');
            return null;
        }
        try {
            const encodedAddress = encodeURIComponent(address.trim());
            const url = `${this.baseUrl}/search/?q=${encodedAddress}&limit=1`;
            this.logger.debug(`Geocoding address: ${address}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                this.logger.error(`Geocoding API error: ${response.status}`);
                return null;
            }
            const data = await response.json();
            if (!data.features || data.features.length === 0) {
                this.logger.warn(`No results for address: ${address}`);
                return null;
            }
            const feature = data.features[0];
            const [longitude, latitude] = feature.geometry.coordinates;
            const result = {
                longitude,
                latitude,
                label: feature.properties.label,
                city: feature.properties.city,
                postalCode: feature.properties.postcode,
                confidence: feature.properties.score,
            };
            this.logger.log(`Geocoded "${address}" → [${latitude}, ${longitude}] (${result.city})`);
            return result;
        }
        catch (error) {
            this.logger.error(`Geocoding failed for "${address}":`, error);
            return null;
        }
    }
    async geocodeCityPostalCode(city, postalCode) {
        const address = `${city} ${postalCode}`;
        return this.geocodeAddress(address);
    }
    async reverseGeocode(longitude, latitude) {
        try {
            const url = `${this.baseUrl}/reverse/?lon=${longitude}&lat=${latitude}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            if (!data.features || data.features.length === 0) {
                return null;
            }
            return data.features[0].properties.label;
        }
        catch (error) {
            this.logger.error(`Reverse geocoding failed:`, error);
            return null;
        }
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = GeocodingService_1 = __decorate([
    (0, common_1.Injectable)()
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map