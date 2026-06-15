# 🍼 My Bibs

Application mobile de suivi de biberons pour bébé, développée avec **React Native + Expo + TypeScript**.

Conçue pour les parents qui se relaient la nuit — interface sombre et apaisante, saisie rapide, historique clair.

**Statut : V1 fonctionnelle**

---

## 📱 Fonctionnalités

| Fonction | Statut |
|---|---|
| Onboarding au premier lancement (prénom + objectif journalier) | ✅ |
| Écran d'accueil — total du jour, barre de progression, refresh minuit | ✅ |
| Sélecteur de quantité −/+ avec chips rapides (60–210 ml) | ✅ |
| Champ heure avec bouton "Maintenant" | ✅ |
| Notes optionnelles par biberon | ✅ |
| Modification d'un biberon existant depuis l'historique | ✅ |
| Historique groupé par jour avec badges colorés | ✅ |
| Suppression d'un biberon par swipe gauche | ✅ |
| Paramètres modifiables (prénom, objectif journalier) | ✅ |
| Stockage local persistant (AsyncStorage) | ✅ |
| IDs uniques via UUID (expo-crypto) | ✅ |
| Fond étoilé animé global (Reanimated) | ✅ |
| Police Nunito (expo-google-fonts) | ✅ |
| Animations de listes (fade + slide) | ✅ |
| Thème dark lavande — design system complet | ✅ |
| Clavier géré sur tous les écrans (KeyboardAwareScrollView) | ✅ |
| Scanner QR code | ✅ |
| Statistiques hebdomadaires | 🔜 |
| Notifications de rappel | 🔜 |

---

## 🛠 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework | React Native + Expo | SDK 54 / RN 0.81.5 |
| Langage | TypeScript | 5.3 |
| Navigation | React Navigation — Stack + Bottom Tabs | 7.x |
| Animations | React Native Reanimated | 4.1 |
| Clavier | react-native-keyboard-aware-scroll-view | 0.9 |
| Persistance | AsyncStorage | 2.2 |
| UUID | expo-crypto | 15.x |
| Police | expo-google-fonts / Nunito | 0.4 |
| Caméra | expo-camera | 17.x |
| Gestures | react-native-gesture-handler | 2.28 |

---

## ⚙️ Installation & lancement

```bash
git clone https://github.com/Wesley971/My_Bibs.git
cd My_Bibs
npm install
npx expo start
```

Scanne le QR code avec **Expo Go** (SDK 54) sur Android ou iOS.
Téléphone et PC doivent être sur le même réseau WiFi.

---

## 📁 Structure du projet

```
My_Bibs/
├── App.tsx                          # Entrée — GestureHandlerRootView + StarfieldBackground
├── app.json                         # Config Expo
├── tsconfig.json                    # Config TypeScript
│
└── src/
    ├── config/
    │   └── constants.ts             # Valeurs partagées (DAILY_GOAL_DEFAULT, seuils badges)
    ├── components/
    │   └── StarfieldBackground.tsx  # Fond étoilé animé (Reanimated, absoluteFill)
    ├── navigation/
    │   └── AppNavigator.tsx         # Stack (Tabs / Paramètres / Édition) + Bottom Tabs
    ├── screens/
    │   ├── HomeScreen.tsx           # Accueil — total jour, progression, liste biberons
    │   ├── AddBottleScreen.tsx      # Ajout / Modification biberon (mode dual)
    │   ├── HistoryScreen.tsx        # Historique groupé par jour, swipe-to-delete
    │   ├── OnboardingScreen.tsx     # Premier lancement — prénom + objectif (2 étapes)
    │   ├── SettingsScreen.tsx       # Paramètres — prénom et objectif modifiables
    │   ├── ScanScreen.tsx           # Scanner QR code
    │   └── StatsScreen.tsx          # Statistiques (placeholder V2)
    ├── storage/
    │   ├── bottleStorage.ts         # CRUD biberons (save / get / update / delete)
    │   └── settingsStorage.ts       # Paramètres utilisateur (childName, dailyGoal)
    └── theme/
        ├── colors.ts                # Tokens couleur dark lavande (#16213E, #A78BFA…)
        ├── spacing.ts               # Échelle d'espacement (xs → xxxl)
        └── typography.ts            # Styles texte (display, hero, body, label…)
```

---

## 🎨 Design system

Thème **dark lavande** défini dans `src/theme/` — agréable la nuit, sans agresser les yeux.

| Token | Valeur | Rôle |
|---|---|---|
| `bg` | `#16213E` | Fond principal |
| `card` | `#1F2B47` | Cartes, lignes de liste |
| `accent` | `#A78BFA` | Lavande — boutons, progression, actif |
| `acL` | `#C4B5FD` | Lavande clair — labels secondaires |
| `text` | `#F8F8FF` | Texte principal |
| `success` | `#34D399` | Confirmation enregistrement |

---

## 🗺 Roadmap V2

- [ ] Statistiques hebdomadaires (graphiques SVG natifs)
- [ ] Notifications de rappel configurables
- [ ] Export des données (CSV / PDF)
- [ ] Publication App Store & Google Play

---

## ✍️ Auteur

Développé avec ❤️ par Wesley.
