import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";
import { useCartStore } from "@/stores/cart-store";
import { PRODUCTS } from "@/utils/data/products";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Feather } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { Image, Text, View } from "react-native";
import colors from "tailwindcss/colors";

export default function Product() {
  const cartStore = useCartStore();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const route = navigation.getState()?.routes;
  const prevRoute = route[route.length - 2];

  const backTitle =
    prevRoute?.name === "cart" ? "Voltar ao carrinho" : "Voltar ao cardápio";
  const backHref = prevRoute?.name === "cart" ? "/cart" : "/";

  const product = PRODUCTS.find((item) => item.id === id);
  const currentQuantity = cartStore.products.find(
    (item) => item.id === id
  )?.quantity;

  function handleAddToCard() {
    if (product) {
      cartStore.add(product);
    }
  }

  function handleRemoveFromCard() {
    if (product) {
      cartStore.remove(product.id);
    }
  }

  if (!product) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1">
      <Image
        source={product.cover}
        className="w-full h-52"
        resizeMode="cover"
      />

      <View className="p-5 mt-8 flex-1">
        <Text className="text-white text-xl font-heading">{product.title}</Text>

        <Text className="text-lime-400 text-2xl font-heading my-2">
          {formatCurrency(product.price)}
        </Text>

        <Text className="text-slate-400 font-body text-base leading-6 mb-6">
          {product.description}
        </Text>

        {product.ingredients.map((ingredient) => (
          <Text
            key={ingredient}
            className="text-slate-400 font-body text-base leading-6"
          >
            {"\u2022"} {ingredient}
          </Text>
        ))}
      </View>

      <View className="p-5 pb-8 gap-5">
        <View className="flex-row gap-2 items-center">
          <Button className="flex-1" onPress={handleAddToCard}>
            <Button.Icon>
              <Feather name="plus-circle" size={20} />
            </Button.Icon>

            <Button.Text>Adicionar ao pedido</Button.Text>
          </Button>

          {currentQuantity! > 0 && (
            <View className="flex-row items-center">
              <Text className="text-slate-900 font-subtitle text-lg py-2 px-4 bg-white rounded-md mr-2">
                {currentQuantity || 0}
              </Text>

              <Feather
                name="minus-circle"
                size={25}
                onPress={handleRemoveFromCard}
                color={colors.red[400]}
              />
            </View>
          )}
        </View>

        <LinkButton title={backTitle} href={backHref} />
      </View>
    </View>
  );
}
