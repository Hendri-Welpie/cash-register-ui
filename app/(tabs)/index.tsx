import Button from "@/components/app/Button";
import Row from "@/components/app/Row";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ⚠️ Change to your machine's local IP when testing on a physical device
// e.g. "http://192.168.1.x:8080/api/v1/charges"
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api/v1/charges";

export default function HomeScreen() {
  const [currentValue, setCurrentValue] = useState("0.00");
  const [items, setItems] = useState<{ id: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + item.value, 0).toFixed(2);

  const fetchCharges = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      setItems(
        data.map((item: any) => ({
          id: item.id,
          value: parseFloat(item.amount),
        })),
      );
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  const addCharge = async () => {
    const amount = parseFloat(currentValue);
    if (amount === 0 || loading) return;

    setLoading(true);

    const idempotencyKey = `${Date.now()}-${Math.random()}`;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ amount }),
      });

      await fetchCharges();
      setCurrentValue("0.00");
    } catch (err) {
      console.error("Add error", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handlePress = (type: string, value: number) => {
    if (type === "ADD") return addCharge();

    if (type === "DEL") {
      const currentCents = Math.round(parseFloat(currentValue) * 100);
      const newCents = Math.floor(currentCents / 10);
      setCurrentValue((newCents / 100).toFixed(2));
    }

    if (type === "number") {
      const currentCents = Math.round(parseFloat(currentValue) * 100);
      const newCents = currentCents * 10 + value;

      if (newCents / 100 > 1_000_000) return;

      setCurrentValue((newCents / 100).toFixed(2));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.displayContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        >
          <Text style={styles.value}>R {currentValue}</Text>
        </ScrollView>
      </View>

      <View>
        <Row>
          <Button text="1" onPress={() => handlePress("number", 1)} />
          <Button text="2" onPress={() => handlePress("number", 2)} />
          <Button text="3" onPress={() => handlePress("number", 3)} />
        </Row>
        <Row>
          <Button text="4" onPress={() => handlePress("number", 4)} />
          <Button text="5" onPress={() => handlePress("number", 5)} />
          <Button text="6" onPress={() => handlePress("number", 6)} />
        </Row>
        <Row>
          <Button text="7" onPress={() => handlePress("number", 7)} />
          <Button text="8" onPress={() => handlePress("number", 8)} />
          <Button text="9" onPress={() => handlePress("number", 9)} />
        </Row>
        <Row>
          <Button text="DEL" onPress={() => handlePress("DEL", 0)} />
          <Button text="0" onPress={() => handlePress("number", 0)} />
          <Button text="ADD" onPress={() => handlePress("ADD", 0)} />
        </Row>
      </View>

      <View style={styles.cartContainer}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>R {item.value.toFixed(2)}</Text>

              <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Text style={styles.delete}>DEL</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No charges yet</Text>
            </View>
          }
          style={{ flex: 1 }}
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>R {total}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8edf4",
  },

  displayContainer: {
    paddingVertical: 40,
    paddingHorizontal: 10,
  },

  value: {
    color: "#2D3142",
    fontSize: 40,
    textAlign: "right",
    fontFamily: "monospace",
  },

  cartContainer: {
    flex: 1,
    backgroundColor: "#545e75",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingEnd: 40,
    paddingVertical: 2,
    alignItems: "center",
  },

  itemText: {
    color: "#f7f9fc",
    fontSize: 18,
    fontFamily: "monospace",
    marginEnd: 15,
  },

  delete: {
    color: "#f7f9fc",
    fontSize: 16,
    borderColor: "#f7f9fc",
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },

  totalRow: {
    borderTopWidth: 1,
    borderColor: "#000",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  totalText: {
    fontSize: 22,
    fontFamily: "monospace",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyText: {
    color: "#c0c8d8",
    fontSize: 16,
    fontFamily: "monospace",
    fontStyle: "italic",
  },
});
