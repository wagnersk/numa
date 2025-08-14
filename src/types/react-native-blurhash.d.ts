declare module "react-native-blurhash" {
  import { ComponentProps } from "react";
  import { ViewStyle } from "react-native";

  interface BlurhashProps {
    blurhash: string;
    style?: ViewStyle;
    decodeWidth?: number;
    decodeHeight?: number;
    decodeAsync?: boolean;
  }

  export class Blurhash extends React.PureComponent<BlurhashProps> {}
}