interface Places {
  id: string;
  title: string;
  description: string;
  coordinates: Coordinates;
  address: string;
  creator: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CustomError extends Error {
  code?: number;
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface DocumentStructure {
  [key: string]: any;
}
export { Places, Coordinates, CustomError, UserDetails,DocumentStructure };
