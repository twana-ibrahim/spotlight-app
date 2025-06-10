import { COLORS } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Login = () => {
  const { startSSOFlow } = useSSO();

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={authStyles.container}>
      <View style={authStyles.brandSection}>
        <View style={authStyles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>

        <Text style={authStyles.appName}>Spotlight</Text>
        <Text style={authStyles.tagline}>don&#39;t miss anything</Text>
      </View>

      <View style={authStyles.illustrationContainer}>
        <Image
          source={require("@/assets/images/auth-bg.png")}
          style={authStyles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={authStyles.loginSection}>
        <TouchableOpacity
          style={authStyles.googleButton}
          activeOpacity={0.9}
          onPress={handleGoogleSignIn}
        >
          <View style={authStyles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>

          <Text style={authStyles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={authStyles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
};
export default Login;
