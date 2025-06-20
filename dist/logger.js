"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logProjectileTrail = exports.logParticle = exports.logAnimal = exports.logProjectile = exports.logPointerEvent = exports.logLayout = exports.logApp = void 0;
const debug_1 = __importDefault(require("debug"));
exports.logApp = (0, debug_1.default)('shooting-app');
exports.logLayout = (0, debug_1.default)('shooting-layout');
exports.logPointerEvent = (0, debug_1.default)('shooting-pointer-event');
exports.logProjectile = (0, debug_1.default)('shooting-projectile');
exports.logAnimal = (0, debug_1.default)('shooting-enemy');
exports.logParticle = (0, debug_1.default)('shooting-particle');
exports.logProjectileTrail = (0, debug_1.default)('shooting-projectile-trail');
//# sourceMappingURL=logger.js.map