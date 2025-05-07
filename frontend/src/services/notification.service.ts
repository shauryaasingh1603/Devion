import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  data?: any;
  createdAt: number;
}

export interface NotificationSettings {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  priceAlerts: boolean;
  riskAlerts: boolean;
  newsAlerts: boolean;
  marketSummary: boolean;
  technicalIndicators: boolean;
  priceAlertThreshold: number;
  riskAlertThreshold: number;
  marketSummaryFrequency: 'daily' | 'weekly';
}

class NotificationService {
  static async getUserNotifications(userId: string, limitCount = 20): Promise<Notification[]> {
    try {
      const notificationsQuery = query(
        collection(firestore, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notifications: Notification[] = [];
      
      notificationsSnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() } as Notification);
      });
      
      return notifications;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get notifications');
    }
  }
  
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const unreadQuery = query(
        collection(firestore, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      
      const unreadSnapshot = await getDocs(unreadQuery);
      
      return unreadSnapshot.size;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get unread count');
    }
  }
  
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(firestore, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark notification as read');
    }
  }
  
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const unreadQuery = query(
        collection(firestore, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      
      const unreadSnapshot = await getDocs(unreadQuery);
      
      const updatePromises = unreadSnapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );
      
      await Promise.all(updatePromises);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark all notifications as read');
    }
  }
  
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, 'notifications', notificationId));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete notification');
    }
  }
  
  static async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const settingsDoc = await getDoc(doc(firestore, 'notificationSettings', userId));
      
      if (settingsDoc.exists()) {
        return settingsDoc.data() as NotificationSettings;
      } else {
        const defaultSettings: NotificationSettings = {
          userId,
          email: true,
          push: true,
          sms: false,
          priceAlerts: true,
          riskAlerts: true,
          newsAlerts: true,
          marketSummary: true,
          technicalIndicators: false,
          priceAlertThreshold: 5,
          riskAlertThreshold: 70,
          marketSummaryFrequency: 'daily'
        };
        
        await setDoc(doc(firestore, 'notificationSettings', userId), defaultSettings);
        
        return defaultSettings;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get notification settings');
    }
  }
  
  static async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'notificationSettings', userId), settings);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update notification settings');
    }
  }
  
  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    try {
      const notificationRef = doc(collection(firestore, 'notifications'));
      const timestamp = Date.now();
      
      const newNotification: Notification = {
        id: notificationRef.id,
        ...notification,
        createdAt: timestamp
      };
      
      await setDoc(notificationRef, newNotification);
      
      return newNotification;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create notification');
    }
  }
}

export default NotificationService;
