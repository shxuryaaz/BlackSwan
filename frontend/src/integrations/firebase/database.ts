import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { signOutUser } from './auth';

// Customer operations
export const addCustomer = async (customerData: any) => {
  return await addDoc(collection(db, 'customers'), {
    ...customerData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
};

export const getCustomers = async (userId: string) => {
  const q = query(
    collection(db, 'customers'),
    where('user_id', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const customers = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Sort in memory instead of in the query
  return customers.sort((a: any, b: any) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB.getTime() - dateA.getTime();
  });
};

export const updateCustomer = async (customerId: string, updates: any) => {
  const docRef = doc(db, 'customers', customerId);
  await updateDoc(docRef, {
    ...updates,
    updated_at: new Date().toISOString()
  });
};

export const deleteCustomer = async (customerId: string) => {
  await deleteDoc(doc(db, 'customers', customerId));
};

// Reminder operations
export const addReminder = async (reminderData: any) => {
  return await addDoc(collection(db, 'reminders'), {
    ...reminderData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
};

export const getReminders = async (userId: string) => {
  const q = query(
    collection(db, 'reminders'),
    where('user_id', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const reminders = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Sort in memory instead of in the query
  return reminders.sort((a: any, b: any) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB.getTime() - dateA.getTime();
  });
};

export const getRemindersWithCustomerData = async (userId: string) => {
  const reminders = await getReminders(userId);
  const customers = await getCustomers(userId);
  
  return reminders.map((reminder: any) => {
    const customer = customers.find((c: any) => c.id === reminder.customer_id) as any;
    return {
      ...reminder,
      customer: customer ? { name: customer.name, email: customer.email } : { name: 'Unknown', email: 'unknown@example.com' }
    };
  });
};

export const updateReminder = async (reminderId: string, updates: any) => {
  const docRef = doc(db, 'reminders', reminderId);
  await updateDoc(docRef, {
    ...updates,
    updated_at: new Date().toISOString()
  });
};

// API Settings operations
export const getApiSettings = async (userId: string) => {
  const q = query(
    collection(db, 'api_settings'),
    where('user_id', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  return null;
};

export const saveApiSettings = async (userId: string, settings: any) => {
  const existingSettings = await getApiSettings(userId);
  
  if (existingSettings) {
    await updateDoc(doc(db, 'api_settings', existingSettings.id), {
      ...settings,
      updated_at: new Date().toISOString()
    });
  } else {
    await addDoc(collection(db, 'api_settings'), {
      user_id: userId,
      ...settings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
};

// User profile operations
export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

// Batch operations for importing multiple customers
export const batchAddCustomers = async (customers: any[]) => {
  const batch = writeBatch(db);
  
  customers.forEach(customer => {
    const docRef = doc(collection(db, 'customers'));
    batch.set(docRef, {
      ...customer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  });
  
  await batch.commit();
};

// Real-time listeners
export const subscribeToCustomers = (userId: string, callback: (customers: any[]) => void) => {
  const q = query(
    collection(db, 'customers'),
    where('user_id', '==', userId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const customers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort in memory
    const sortedCustomers = customers.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });
    callback(sortedCustomers);
  });
};

export const subscribeToReminders = (userId: string, callback: (reminders: any[]) => void) => {
  const q = query(
    collection(db, 'reminders'),
    where('user_id', '==', userId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const reminders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort in memory
    const sortedReminders = reminders.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });
    callback(sortedReminders);
  });
};

// Re-export signOutUser for convenience
export { signOutUser };

// Utility functions for customer status and risk calculation
export const calculateCustomerStatus = (dueDate: string, currentStatus: string): string => {
  if (currentStatus === 'paid') return 'paid';
  
  const due = new Date(dueDate);
  const today = new Date();
  return due < today ? 'overdue' : 'pending';
};

export const calculateCustomerRiskLevel = (dueDate: string, amountDue: number, currentStatus: string): string => {
  if (currentStatus === 'paid') return 'low';
  
  const due = new Date(dueDate);
  const today = new Date();
  const daysOverdue = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysOverdue > 30 || amountDue > 50000) {
    return 'high';
  } else if (daysOverdue > 7 || amountDue > 15000) {
    return 'medium';
  } else {
    return 'low';
  }
};

export const updateCustomerStatusAndRisk = async (customerId: string, dueDate: string, amountDue: number, currentStatus: string) => {
  const newStatus = calculateCustomerStatus(dueDate, currentStatus);
  const newRiskLevel = calculateCustomerRiskLevel(dueDate, amountDue, currentStatus);
  
  await updateCustomer(customerId, {
    status: newStatus,
    risk_level: newRiskLevel
  });
  
  return { status: newStatus, risk_level: newRiskLevel };
}; 