import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function shareCSV(csvContent: string, childName: string): Promise<void> {
  const now      = new Date();
  const dateStr  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const safeName = childName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `biberons_${safeName}_${dateStr}.csv`;
  const fileUri  = (FileSystem.cacheDirectory ?? '') + fileName;

  try {
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Non disponible', 'Le partage n\'est pas supporté sur cet appareil.');
      return;
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Exporter les données',
    });
  } catch {
    Alert.alert('Erreur', 'Impossible de partager le fichier.');
  }
}
