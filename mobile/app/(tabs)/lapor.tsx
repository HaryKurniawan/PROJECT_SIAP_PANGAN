import { View } from 'react-native';

export default function LaporPlaceholder() {
  // This screen won't be seen because the tabBarButton intercepts the press,
  // but it needs to exist for the tab bar to show the icon.
  return <View style={{ flex: 1, backgroundColor: 'white' }} />;
}
