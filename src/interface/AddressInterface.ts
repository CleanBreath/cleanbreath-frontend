export interface Address {
    road_address : roadAddressProps | undefined;
    address : normalAddressProps | undefined;
}

interface roadAddressProps {
    address_name? : string;
    road_name? : string;
    building_name? : string;
}

interface normalAddressProps {
    address_name? : string;
}