import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export type Bottle = {
  id: string;
  quantity: number;
  timestamp: string;
  notes: string;
  schemaVersion?: number;
};

type PartialBottle = Omit<Bottle, 'notes'> & { notes?: string };

const isBottle = (obj: unknown): obj is PartialBottle =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof (obj as Record<string, unknown>).id === 'string' &&
  typeof (obj as Record<string, unknown>).quantity === 'number' &&
  typeof (obj as Record<string, unknown>).timestamp === 'string' &&
  (typeof (obj as Record<string, unknown>).notes === 'string' ||
   typeof (obj as Record<string, unknown>).notes === 'undefined') &&
  (typeof (obj as Record<string, unknown>).schemaVersion === 'number' ||
   typeof (obj as Record<string, unknown>).schemaVersion === 'undefined');

// Sauvegarder un biberon avec date et heure
export const saveBottle = async (quantity: string, date: Date, notes?: string) => {
  if (!quantity || isNaN(Number(quantity))) {
    throw new Error("Quantité invalide : " + quantity);
  }

  const bottles = await getBottles();
  const newBottle = {
    id: Crypto.randomUUID(),
    quantity: Number(quantity),
    timestamp: date.toISOString(),
    notes: notes || "",
    schemaVersion: 1,
  };
  bottles.push(newBottle);

  await AsyncStorage.setItem("bottles", JSON.stringify(bottles));
};

// Récupérer tous les biberons
export const getBottles = async (): Promise<Bottle[]> => {
  const raw = await AsyncStorage.getItem("bottles");
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as unknown[]).filter(isBottle).map(b => ({
      ...b,
      notes: b.notes ?? '',
      schemaVersion: b.schemaVersion ?? 0,
    }));
  } catch {
    console.warn('[bottleStorage] Données corrompues, réinitialisation.');
    await AsyncStorage.removeItem("bottles");
    return [];
  }
};

// Modifier un biberon existant par ID
export const updateBottle = async (
  id: string,
  quantity: number,
  timestamp: string,
  notes: string,
): Promise<void> => {
  const bottles = await getBottles();
  const updated = bottles.map(b =>
    b.id === id ? { ...b, quantity, timestamp, notes, schemaVersion: 1 } : b
  );
  await AsyncStorage.setItem("bottles", JSON.stringify(updated));
};

// Supprimer un biberon par ID
export const deleteBottle = async (id: string) => {
  let bottles = await getBottles();
  bottles = bottles.filter(bottle => bottle.id !== id);
  await AsyncStorage.setItem("bottles", JSON.stringify(bottles));
};
