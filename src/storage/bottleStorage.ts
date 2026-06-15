import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export type Bottle = {
  id: string;
  quantity: number;
  timestamp: string;
  notes: string;
};

const isBottle = (obj: unknown): obj is Bottle =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof (obj as Record<string, unknown>).id === 'string' &&
  typeof (obj as Record<string, unknown>).quantity === 'number' &&
  typeof (obj as Record<string, unknown>).timestamp === 'string';

// Sauvegarder un biberon avec date et heure
export const saveBottle = async (quantity: string, date: Date, notes?: string) => {
  try {
    if (!quantity || isNaN(Number(quantity))) {
      throw new Error("Quantité invalide : " + quantity);
    }

    const bottles = await getBottles();
    const newBottle = {
      id: Crypto.randomUUID(),
      quantity: Number(quantity),
      timestamp: date.toISOString(),
      notes: notes || "",
    };
    bottles.push(newBottle);

    await AsyncStorage.setItem("bottles", JSON.stringify(bottles));
  } catch (error) {
    throw error;
  }
};

// Récupérer tous les biberons
export const getBottles = async (): Promise<Bottle[]> => {
  try {
    const bottles = await AsyncStorage.getItem("bottles");
    return bottles
      ? (JSON.parse(bottles) as unknown[]).filter(isBottle)
      : [];
  } catch (error) {
    throw error;
  }
};

// Modifier un biberon existant par ID
export const updateBottle = async (
  id: string,
  quantity: number,
  timestamp: string,
  notes: string,
): Promise<void> => {
  try {
    const bottles = await getBottles();
    const updated = bottles.map(b =>
      b.id === id ? { ...b, quantity, timestamp, notes } : b
    );
    await AsyncStorage.setItem("bottles", JSON.stringify(updated));
  } catch (error) {
    throw error;
  }
};

// Supprimer un biberon par ID
export const deleteBottle = async (id: string) => {
  try {
    let bottles = await getBottles();
    bottles = bottles.filter(bottle => bottle.id !== id);
    await AsyncStorage.setItem("bottles", JSON.stringify(bottles));
  } catch (error) {
    throw error;
  }
};
