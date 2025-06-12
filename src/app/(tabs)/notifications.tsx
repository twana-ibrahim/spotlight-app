import EmptyScreen from "@/components/EmptyScreen";
import Loader from "@/components/Loader";
import { notificationStyles } from "@/styles/notification.styles";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { FlatList, Text, View } from "react-native";
import Notification from "../../components/Notification";

const Notifications = () => {
  const notifications = useQuery(api.notifications.getNotifications);

  if (!notifications) return <Loader />;

  if (!notifications.length) return <EmptyScreen text="notification" />;

  return (
    <View style={notificationStyles.container}>
      <View style={notificationStyles.header}>
        <Text style={notificationStyles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => <Notification notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={notificationStyles.listContainer}
      />
    </View>
  );
};
export default Notifications;
