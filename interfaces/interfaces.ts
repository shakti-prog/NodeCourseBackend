interface Places {
  id: string;
  title: string;
  description: string;
  coordinates: Coordinates;
  address: string;
  creator: string;
  image: string;
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
  image: string;
  places: [];
}

interface DocumentStructure {
  [key: string]: any;
}

interface Product {
  productName: string;
  productId: string;
  productDescription: string;
  price: Number;
}
export {
  Places,
  Coordinates,
  CustomError,
  UserDetails,
  DocumentStructure,
  Product,
};
