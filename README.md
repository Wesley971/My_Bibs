# 🍼 My Bibs

Application mobile de suivi de biberons pour bébé, développée avec **React Native + Expo + TypeScript**.

Conçue pour les parents qui se relaient la nuit — interface sombre et apaisante, saisie rapide, historique clair.

---

## 📱 Fonctionnalités

| Fonction                                                   | Statut |
| ---------------------------------------------------------- | ------ |
| Écran d'accueil avec total du jour et barre de progression | ✅     |
| Sélecteur de quantité −/+ avec chips rapides (60–210 ml)   | ✅     |
| Champ heure avec bouton "Maintenant"                       | ✅     |
| Notes optionnelles par biberon                             | ✅     |
| Historique groupé par jour avec badges colorés             | ✅     |
| Swipe gauche pour supprimer une entrée                     | ✅     |
| Scanner QR code pour enregistrer un biberon                | ✅     |
| Stockage local persistant (AsyncStorage)                   | ✅     |
| IDs uniques via UUID (expo-crypto)                         | ✅     |
| Design system dark lavande (src/theme/)                    | ✅     |
| Écran statistiques                                         | 🔜     |
| Animations (barre de progression, chips, FadeInDown)       | 🔜     |
| Police Nunito (expo-google-fonts)                          | 🔜     |
| Fond étoilé global                                         | 🔜     |

---

## 🛠 Technologies

- [React Native](https://reactnative.dev/) + [Expo SDK 54](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/) (Bottom Tabs)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) (persistance locale)
- [expo-crypto](https://docs.expo.dev/versions/latest/sdk/crypto/) (UUID)
- [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) (scan QR)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) (swipe-to-delete)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) (animations, à venir)

---

## ⚙️ Installation

```bash
git clone https://github.com/Wesley971/My_Bibs.git
cd My_Bibs
npm install
npx expo start
```

Scanne le QR code avec **Expo Go** (SDK 54) sur ton téléphone Android ou iOS.
Assure-toi que ton téléphone et ton PC sont sur le même réseau WiFi.

---

## 📁 Structure du projet

```
My_Bibs/
├── App.tsx                        # Entrée principale — GestureHandlerRootView
├── app.json                       # Config Expo
├── tsconfig.json                  # Config TypeScript
│
└── src/
    ├── screens/
    │   ├── HomeScreen.tsx         # Accueil — total jour, progression, liste
    │   ├── AddBottleScreen.tsx    # Ajout — sélecteur −/+, chips, heure, notes
    │   ├── HistoryScreen.tsx      # Historique — groupé par jour, swipe-to-delete
    │   ├── ScanScreen.tsx         # Scan QR code — enregistrement automatique
    │   └── StatsScreen.tsx        # Statistiques (à venir)
    ├── navigation/
    │   └── AppNavigator.tsx       # Bottom Tab Navigator
    ├── storage/
    │   └── bottleStorage.ts       # CRUD AsyncStorage + type guard + UUID
    ├── components/
    │   └── ScreenWrapper.tsx      # Wrapper global — fond dark, StatusBar light
    └── theme/
        ├── colors.ts              # Tokens de couleur (dark lavande)
        ├── spacing.ts             # Échelle d'espacement (xs → xxxl)
        └── typography.ts          # Styles de texte (display, hero, body...)
```

---

## 🎨 Design System

L'app utilise un thème **dark lavande** défini dans `src/theme/`, conçu pour être agréable à utiliser la nuit sans agresser les yeux.

Les couleurs principales sont le fond `#16213E` (bleu nuit profond), l'accent `#A78BFA` (lavande vif), les cartes en `#1F2B47`, et le texte principal en `#F8F8FF`. Toutes les couleurs sont centralisées dans `colors.ts` pour faciliter la maintenance — changer une teinte se fait en une seule ligne.

---

## 🔒 Qualité du code

Le projet a fait l'objet d'un audit complet avec les corrections suivantes : remplacement de `Date.now()` par des UUIDs via `expo-crypto`, propagation des erreurs de storage vers l'UI via `throw`, utilisation de `useFocusEffect` pour le rafraîchissement de l'historique, tri newest-first, type guard sur `JSON.parse()`, et suppression de tous les imports morts.

---

## ✍️ Auteur

Développé avec ❤️ par Wesley.
