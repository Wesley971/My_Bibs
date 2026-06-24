# My Bibs

![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)

Application mobile de suivi de biberons pour parents, construite avec React Native et Expo.

---

## Apercu

- **Suivi quotidien** : total du jour, barre de progression vers l'objectif personnalise, liste des biberons horodates avec rafraichissement automatique a minuit.
- **Historique complet** : biberons regroupes par jour, modifiables et supprimables avec confirmation.
- **Statistiques 7 jours** : graphique en barres natif, streak de jours consecutifs, metriques de la semaine (moyenne, meilleur jour, total).
- **Scanner QR** : reconnaissance de codes-barres via la camera avec animation de visee Reanimated.
- **Export CSV** : historique complet au format Excel francais, partageable via la feuille de partage native iOS et Android.

---

## Stack technique

| Technologie | Role |
|---|---|
| React Native 0.81 | Framework mobile iOS / Android |
| Expo SDK 54 | Toolchain, modules natifs, builds |
| TypeScript 5.3 | Typage statique |
| React Navigation 7 | Navigation par onglets (Bottom Tabs) et par pile (Stack) |
| Reanimated 4 | Animations fluides : skeleton loaders, fond etoile, FAB |
| Gesture Handler 2 | Gestion des gestes tactiles |
| react-native-svg | Ligne pointillee d'objectif dans le graphique de statistiques |
| expo-camera | Scanner de codes QR / barres |
| expo-sharing | Partage natif du fichier CSV |
| expo-file-system | Ecriture du fichier temporaire avant partage |
| AsyncStorage 2.2 | Persistance locale des biberons et des reglages |
| @expo-google-fonts/nunito | Typographie (Regular, SemiBold, ExtraBold) |

---

## Architecture

```
src/
├── components/    Composants reutilisables (SkeletonRow, StarfieldBackground)
├── hooks/         Hooks personnalises (useBottlesForToday)
├── navigation/    Definition des navigateurs, types de routes (TabParamList, RootStackParamList)
├── screens/       Ecrans de l'application (Accueil, Historique, Stats, Ajout, Scan, Parametres)
├── storage/       Couche d'acces aux donnees AsyncStorage (biberons, reglages)
├── theme/         Design tokens : couleurs, espacements, typographie
└── utils/         Fonctions utilitaires : calculs statistiques, generation CSV, partage
```

---

## Fonctionnalites detaillees

### Suivi quotidien

`HomeScreen` affiche le total du jour et la liste des biberons sous forme de carte animee. Le hook `useBottlesForToday` combine trois mecanismes de rafraichissement : `useFocusEffect` (retour sur l'onglet), un `setTimeout` recalcule vers minuit exact, et un listener `AppState` qui detecte le retour au premier plan un nouveau jour. Le total et la barre de progression se mettent a jour sans intervention de l'utilisateur.

### Historique groupe par jour

`HistoryScreen` regroupe les biberons en sections journalieres via `SectionList`. La suppression d'un biberon demande une confirmation explicite (`Alert.alert`) avant d'agir sur le stockage. Un toast anime (Reanimated, fondu en sortie) confirme l'action. La modification ouvre `AddBottleScreen` en mode edition via la navigation par pile, en preservant la date d'origine du biberon et en n'actualisant que l'heure.

### Statistiques 7 jours

`StatsScreen` calcule via `statsUtils` les totaux des sept derniers jours, le meilleur jour, la moyenne quotidienne, le nombre de jours ou l'objectif est atteint et le streak courant. Le graphique est rendu avec des `View` natives pour les barres -- colorees en vert (`#34D399`) si l'objectif est atteint, en violet (`#A78BFA`) sinon -- et `react-native-svg` pour la ligne horizontale pointillee positionnee a la hauteur exacte de l'objectif. La largeur du graphique est mesuree dynamiquement via `onLayout` pour que l'overlay SVG soit correctement dimensionne. Les donnees sont rechargees a chaque visite de l'onglet via `useFocusEffect`.

### Ajout et edition de biberons

`AddBottleScreen` couvre l'ajout rapide et la modification. La quantite se regle par les boutons +/- ou via des chips de valeurs predefinies (60 a 210 ml). L'heure est saisie via trois modes : bouton "Maintenant", valeur affichee directement, ou `DateTimePicker` natif declenche par le bouton "Choisir". Un retour visuel (bouton vert, texte "Enregistre !") confirme la sauvegarde avant de reinitialiser le formulaire. En mode edition, la confirmation declenche la navigation retour automatiquement.

### Scanner QR

`ScanScreen` utilise `expo-camera` en mode portrait et anime un cadre de visee avec Reanimated (pulsation en boucle). Un `useRef` booleen garde la trace du traitement en cours pour eviter les doubles declenchements provenant de la callback `onBarcodeScanned`. La camera est desactivee des qu'un code est reconnu pour eviter les rescans involontaires.

### Export CSV

`exportBottlesToCSV` trie l'historique complet par date et heure croissantes et genere un CSV separe par point-virgule (compatible Excel en parametres regionaux francais). Les notes contenant une virgule ou un point-virgule sont automatiquement entourees de guillemets doubles. `shareCSV` ecrit le fichier dans le cache de l'application via `expo-file-system`, verifie la disponibilite du partage via `Sharing.isAvailableAsync()`, puis ouvre la feuille de partage native avec le type MIME `text/csv`.

### Design system

Le fond anime `StarfieldBackground` genere des etoiles positionnees aleatoirement dont la taille pulse en boucle avec `useSharedValue` et des animations `withRepeat` / `withSequence` de Reanimated. Les design tokens (`colors`, `spacing`, `typography`) centralisent la palette "Lavande et Brume" (`#16213E` fond principal, `#A78BFA` accent violet, `#34D399` succes vert, `#EF4444` erreur rouge). Le composant `SkeletonRow` fournit des placeholders rectangulaires pulsants pendant les chargements asynchrones, en remplacement des `ActivityIndicator` sur tous les ecrans.

---

## Choix techniques notables

**AsyncStorage plutot qu'une base de donnees.** L'application est entierement locale, sans backend ni synchronisation reseau. AsyncStorage suffit pour le volume de donnees attendu (quelques centaines de biberons) et evite toute dependance a SQLite ou Realm, qui ajouteraient une complexite de migration sans benefice reel dans ce contexte.

**`useRef` comme garde dans le scanner.** La callback `onBarcodeScanned` d'`expo-camera` se declenche plusieurs fois par image. Un etat React serait sujet aux stale closures lors des re-renders rapides. Un `useRef` mis a jour de facon synchrone garantit qu'un seul traitement s'execute par scan, independamment du cycle de rendu.

**Double mecanisme de rafraichissement a minuit.** Un `setTimeout` calcule vers minuit exact est susceptible d'etre suspendu par le systeme lorsque l'application passe en arriere-plan. Le listener `AppState` prend le relai : des que l'utilisateur revient dans l'application un nouveau jour calendaire, les biberons sont recharges. Les deux mecanismes sont complementaires et se couvrent mutuellement.

**Barres du graphique en `View` natives.** `victory-native` 41 a migre vers une API Skia (`CartesianChart`) incompatible avec l'ancienne API `VictoryBar`. L'approche retenue -- `View` flexbox pour les barres, `react-native-svg` pour la ligne pointillee -- offre un controle total sur la couleur de chaque barre selon l'objectif atteint, sans dependance au moteur de rendu Skia ni a la police requise par `CartesianChart`.

**`schemaVersion` dans le stockage.** Le schema des donnees inclut un champ de version pour permettre des migrations futures des entrees AsyncStorage sans perte de donnees lors des mises a jour de l'application. Toute evolution du modele peut etre detectee a la lecture et migree en place.

---

## Installation et lancement

```bash
git clone https://github.com/wesley971/my-bibs.git
cd my-bibs
npm install
npx expo start
```

Scanner le QR code avec l'application **Expo Go** sur un appareil physique, ou lancer sur un emulateur Android / simulateur iOS.

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npx expo start` | Demarre le serveur de developpement Metro |
| `npx expo start --clear` | Demarre en vidant le cache Metro |
| `npx expo run:android` | Build natif et lance sur Android (requiert Android Studio) |
| `npx expo run:ios` | Build natif et lance sur iOS (requiert Xcode, macOS uniquement) |

---

## Auteur

**Wesley** - Developpeur Full Stack TypeScript

[github.com/wesley971](https://github.com/wesley971)
