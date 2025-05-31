import { Stack} from "expo-router";
import React, { useEffect } from 'react';
import  Header  from "../components/header"
import { ChatProvider } from './ChatContext';
import { Image} from 'react-native';
import MsgHeader from "../components/msgHeader";
import { useNavigation } from "expo-router";

export default function RootLayout() {
  const navigation=useNavigation()
  // useEffect(()=>{
  //   navigation.navigate("auth/changepass");
  // })
  return (
    <ChatProvider>
    <Stack>
      <Stack.Screen name="index" options={{
          headerShown:false,
        }}/>
      <Stack.Screen name="auth/login" options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="auth/singup" options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="auth/otp" options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="auth/forgotpass" options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="auth/changepass" options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="(tabs)" options={{
        header:()=> <Header/>
      }}/>
      <Stack.Screen name="screens/profile" options={{
        headerTitle:"Profile",
        headerTitleStyle:{
          fontSize:30
        },
        headerStyle:{
          backgroundColor:"#e6f7fa"
        }
      }}/>
      <Stack.Screen name="screens/chatpage"
        options={({ route }) => ({
          header: () => (
            <MsgHeader 
              userName={route.params.details.user} // Pass the user's name
              profileImage={route.params.details.profileImage} // Pass the profile image
            />
          )
        })}/>
    </Stack>
    </ChatProvider>
  );
}