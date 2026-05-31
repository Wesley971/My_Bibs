import { StatusBar } from 'expo-status-bar';
import { Dimensions, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {
  const {height} = Dimensions.get('window');
  let paddingTop = Platform.OS === 'ios' ? height * 0.08 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop }, style]}>
      <StatusBar style="light" backgroundColor={colors.bg} />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  }
});