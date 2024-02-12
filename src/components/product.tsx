import { useCartStore } from "@/stores/cart-store";
import { ProductProps } from "@/utils/data/products";
import { Feather } from "@expo/vector-icons";
import { forwardRef } from "react";
import {
  Alert,
  Image,
  ImageProps,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import colors from "tailwindcss/colors";

type ProductDataProps = {
  title: string;
  description: string;
  thumbnail: ImageProps;
  quantity?: number;
};

type ProductsProps = TouchableOpacityProps & {
  data: ProductProps & ProductDataProps;
};

export const Product = forwardRef<TouchableOpacity, ProductsProps>(
  ({ data, ...rest }, ref) => {
    const cartStore = useCartStore();
    const productQuantity = data?.quantity || 0;

    const handleAddProduct = () => {
      if (data) {
        cartStore.add(data);
      }
    };
    const handleRemoveProduct = () => {
      if (data) {
        if (productQuantity > 1) {
          cartStore.remove(data.id);
        } else {
          Alert.alert("Remover", `Deseja remover ${data.title} do carrinho?`, [
            {
              text: "Cancelar",
            },
            {
              text: "Remover",
              onPress: () => cartStore.remove(data.id),
            },
          ]);
        }
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        className="w-full flex-row items-center pb-4"
        {...rest}
      >
        <Image source={data.thumbnail} className="w-20 h-20 rounded-md" />

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-slate-100 font-subtitle text-base flex-1">
              {data.title}
            </Text>

            {data.quantity && (
              <View className="flex-row gap-2 justify-center items-center">
                {productQuantity > 1 ? (
                  <Feather
                    name="minus-circle"
                    size={25}
                    color="#FF6347"
                    className="ml-2"
                    onPress={handleRemoveProduct}
                  />
                ) : (
                  <Feather
                    name="trash-2"
                    size={25}
                    color="#FF6347"
                    className="ml-2"
                    onPress={handleRemoveProduct}
                  />
                )}

                <Text className="text-slate-400 font-subtitle text-sm">
                  {data.quantity}
                </Text>

                <Feather
                  name="plus-circle"
                  size={25}
                  color={colors.lime[400]}
                  className="mr-2"
                  onPress={handleAddProduct}
                />
              </View>
            )}
          </View>

          <Text className="text-slate-400 text-xs leading-5 mt-0.5">
            {data.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);
