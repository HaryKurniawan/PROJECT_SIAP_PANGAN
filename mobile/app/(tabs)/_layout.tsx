import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { Home, FileSearch, LineChart, BookOpen, AlertTriangle } from 'lucide-react-native';

function LogoHeader() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 4 }}>
      <Image 
        source={require('../../assets/images/logo.jpeg')} 
        style={{ width: 72, height: 72, borderRadius: 20 }}
        resizeMode="contain"
      />
      <View style={{ justifyContent: 'center', gap: -2 }}>
        <Text style={{ fontSize: 17, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 }}>SIAP PANGAN</Text>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#64748b' }}>Polres Brebes</Text>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerTitleContainerStyle: {
          marginLeft: 12,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          height: 105, 
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f1f5f9',
        },
        headerTintColor: '#1e293b',
        headerTitle: () => <LogoHeader />,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 0,
          paddingBottom: 4,
        },
        tabBarStyle: {
          height: 85,
          paddingTop: 10,
          paddingBottom: 15,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <Home size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="harga"
        options={{
          title: 'Harga',
          tabBarIcon: ({ color }) => <LineChart size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lapor"
        options={{
          title: 'Lapor',
          tabBarButton: (props: any) => (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Pressable
                onPress={props.onPress}
                style={{
                  top: -35,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#3b82f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#3b82f6',
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <AlertTriangle size={28} color="white" />
              </Pressable>
              <Text style={{ 
                fontSize: 11, 
                fontWeight: '600', 
                color: props.accessibilityState?.selected ? '#3b82f6' : '#94a3b8',
                position: 'absolute',
                bottom: 12
              }}>Lapor</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="edukasi"
        options={{
          title: 'Edukasi',
          tabBarIcon: ({ color }) => <BookOpen size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cek-laporan"
        options={{
          title: 'Status',
          tabBarIcon: ({ color }) => <FileSearch size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
