"use strict";
/**
 * @lesextras/types
 * Single Source of Truth for all types shared between API and Web
 *
 * This package re-exports Prisma generated types and adds custom DTOs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = exports.PostType = exports.BookingStatus = exports.MissionUrgency = exports.MissionStatus = exports.ServiceType = exports.UserStatus = exports.UserRole = void 0;
// =============================================================================
// PRISMA GENERATED TYPES & ENUMS
// Re-export everything from Prisma Client
// =============================================================================
var client_1 = require("@prisma/client");
// Enums
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return client_1.UserRole; } });
Object.defineProperty(exports, "UserStatus", { enumerable: true, get: function () { return client_1.UserStatus; } });
Object.defineProperty(exports, "ServiceType", { enumerable: true, get: function () { return client_1.ServiceType; } });
Object.defineProperty(exports, "MissionStatus", { enumerable: true, get: function () { return client_1.MissionStatus; } });
Object.defineProperty(exports, "MissionUrgency", { enumerable: true, get: function () { return client_1.MissionUrgency; } });
Object.defineProperty(exports, "BookingStatus", { enumerable: true, get: function () { return client_1.BookingStatus; } });
Object.defineProperty(exports, "PostType", { enumerable: true, get: function () { return client_1.PostType; } });
Object.defineProperty(exports, "TransactionType", { enumerable: true, get: function () { return client_1.TransactionType; } });
Object.defineProperty(exports, "TransactionStatus", { enumerable: true, get: function () { return client_1.TransactionStatus; } });
