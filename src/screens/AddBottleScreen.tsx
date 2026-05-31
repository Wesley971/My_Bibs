import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, TextInput, Card, Snackbar, useTheme } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { saveBottle } from "../storage/bottleStorage";
import ScreenWrapper from "../components/ScreenWrapper";

type AddBottleScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Ajout">;
};

type SnackbarType = 'error' | 'success';

const AddBottleScreen: React.FC<AddBottleScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');

  const onSaveBottle = async () => {
    const quantityNum = Number(quantity);
    
    if (!quantity || isNaN(quantityNum)) {
      showSnackbar("Veuillez entrer une quantité valide en ml.", 'error');
      return;
    }

    try {
      await saveBottle(quantity, date, notes);
      setQuantity("");
      setNotes("");
      setDate(new Date());
      showSnackbar("Biberon ajouté avec succès !", 'success');
    } catch (e) {
      showSnackbar("Erreur lors de la sauvegarde. Veuillez réessayer.", 'error');
    }
  };

  const showSnackbar = (message: string, type: SnackbarType) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const getSnackbarStyle = () => {
    if (snackbarType === 'error') {
      return { backgroundColor: theme.colors.error };
    }
    return { backgroundColor: theme.colors.primary };
  };

  return (
    <ScreenWrapper>
      <Card style={styles.card}>
        <Card.Title title="Ajout d'un Biberon 🍼" />
        <Card.Content style={styles.content}>
          <TextInput
            mode="outlined"
            label="Quantité (ml)"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            style={styles.input}
            placeholder={`250`}
          />
          <TextInput
            mode="outlined"
            label="Notes (optionnel)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <Button mode="contained" onPress={onSaveBottle} style={styles.button}>
            Enregistrer
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate("Historique")} 
            style={styles.link}
            icon="history"
          >
            Voir l'historique
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={getSnackbarStyle()}
      >
        {snackbarMessage}
      </Snackbar>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: { 
    width: "100%", 
    backgroundColor: "#FFFFFF",
    elevation: 4,
  },
  content: { 
    gap: 15,
    padding: 10,
  },
  input: { 
    marginBottom: 5,
  },
  button: { 
    backgroundColor: "#FADADD",
    marginTop: 10,
  },
  link: { 
    marginTop: 5,
    borderColor: "#FADADD",
  },
  dateButton: {
    borderColor: "#FADADD",
  },
});

export default AddBottleScreen;
