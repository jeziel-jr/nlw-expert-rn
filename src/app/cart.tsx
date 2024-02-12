import { ProductCartProps, useCartStore } from "@/stores/cart-store";

import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { Link, useNavigation } from "expo-router";

const PHONE_NUMBER = "5581989707979";

export default function Card() {
  const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe os dados da entrega");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

    const message = `
    🍔 NOVO PEDIDO
    \n Entregar em: ${address}

    ${products}

    \n Valor total: ${total}
    `;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );

    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu Carrinho" />

      <KeyboardAwareScrollView extraHeight={180}>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    asChild
                  >
                    <Product data={product} />
                  </Link>
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio.
              </Text>
            )}

            {cartStore.products.length > 0 && (
              <View>
                <View className="flex-row gap-2 items-center mt-5 mb-4">
                  <Text className="text-white text-xl font-subtitle">
                    Total:
                  </Text>

                  <Text className="text-lime-400 text-2xl font-heading">
                    {total}
                  </Text>
                </View>

                <Input
                  placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
                  onChangeText={setAddress}
                  // blurOnSubmit
                  // onSubmitEditing={handleOrder}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao Cardápio" href="/" />
      </View>
    </View>
  );
}
