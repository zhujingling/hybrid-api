import { Location, LocationInfo } from './apis/location';
import { Navigation } from './apis/navigation';
import { Util, ShareArgs } from './apis/util';

export class HybridEngine {
    location = new Location();
    navigation = new Navigation();
    util = new Util();
}

export const hybrid = new HybridEngine();

export {
    Location,
    LocationInfo,
    Navigation,
    Util,
    ShareArgs
}