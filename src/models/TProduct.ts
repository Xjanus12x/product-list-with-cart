type TProduct = {
  image: TImage;
  name: string;
  category: string;
  price: number;
};

export type TImage = {
  thumbnail: string;
  mobile: string;
  tablet: string;
  desktop: string;
};

export default TProduct;
