import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { GalleryItem, SiteConfig, HistoryPhoto, DEFAULT_GALLERY_ITEMS, DEFAULT_SITE_CONFIG, DEFAULT_HISTORY_PHOTOS } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyCV_g0o6RcXAlM8aDZ25UQ89MeAjjm_LB4",
  authDomain: "gen-lang-client-0958303804.firebaseapp.com",
  projectId: "gen-lang-client-0958303804",
  storageBucket: "gen-lang-client-0958303804.firebasestorage.app",
  messagingSenderId: "998627175913",
  appId: "1:998627175913:web:98d09e38ab0379c6a8ef78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
export const db = getFirestore(app, "ai-studio-raceboy-4fec02b3-b19e-45d3-bd29-40f2dbb70fbd");

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
}

// Subscribe to Gallery items in real-time
export function subscribeGallery(callback: (items: GalleryItem[]) => void) {
  const galleryRef = collection(db, "gallery");
  const q = query(galleryRef, orderBy("order", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
      } else {
        const items: GalleryItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as GalleryItem);
        });
        callback(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, "gallery");
      // Fallback
      callback(DEFAULT_GALLERY_ITEMS);
    }
  );
}

// Subscribe to Site Configuration in real-time
export function subscribeSiteConfig(callback: (config: SiteConfig) => void) {
  const configDocRef = doc(db, "siteConfig", "main");

  return onSnapshot(
    configDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SiteConfig);
      } else {
        callback(DEFAULT_SITE_CONFIG);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, "siteConfig/main");
      callback(DEFAULT_SITE_CONFIG);
    }
  );
}

// Add or update a gallery item
export async function saveGalleryItem(item: Omit<GalleryItem, "id"> & { id?: string }) {
  const path = "gallery";
  try {
    const id = item.id || `gal-${Date.now()}`;
    const itemRef = doc(db, "gallery", id);
    const payload = {
      title: item.title,
      client: item.client,
      specs: item.specs,
      image: item.image,
      glowClass: item.glowClass || "border-glow-pink hover:shadow-[0_0_20px_rgba(255,0,127,0.4)]",
      order: item.order ?? Date.now()
    };
    await setDoc(itemRef, payload, { merge: true });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Delete a gallery item
export async function deleteGalleryItem(id: string) {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, "gallery", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// Update site config
export async function saveSiteConfig(config: Partial<SiteConfig>) {
  const path = "siteConfig/main";
  try {
    const docRef = doc(db, "siteConfig", "main");
    await setDoc(docRef, config, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Subscribe to History Photos in real-time
export function subscribeHistoryPhotos(callback: (photos: HistoryPhoto[]) => void) {
  const historyRef = collection(db, "history_photos");

  return onSnapshot(
    historyRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
      } else {
        const photos: HistoryPhoto[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          photos.push({
            id: docSnap.id,
            title: data.title || "",
            description: data.description || "",
            category: data.category || "eventos",
            imageUrl: data.imageUrl || "",
            year: data.year || "",
            location: data.location || "",
            createdAt: data.createdAt || 0
          });
        });
        photos.sort((a, b) => {
          const yearA = parseInt(a.year || "0", 10);
          const yearB = parseInt(b.year || "0", 10);
          if (yearB !== yearA) {
            return yearB - yearA;
          }
          return (b.createdAt || 0) - (a.createdAt || 0);
        });
        callback(photos);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, "history_photos");
      callback(DEFAULT_HISTORY_PHOTOS);
    }
  );
}

// Add or update a history photo
export async function saveHistoryPhoto(photo: Omit<HistoryPhoto, "id"> & { id?: string }) {
  const path = "history_photos";
  try {
    const id = photo.id || `h-${Date.now()}`;
    const docRef = doc(db, "history_photos", id);
    const payload = {
      title: photo.title,
      description: photo.description || "",
      category: photo.category || "eventos",
      imageUrl: photo.imageUrl,
      year: photo.year || "",
      location: photo.location || "",
      createdAt: photo.createdAt || Date.now()
    };
    await setDoc(docRef, payload, { merge: true });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Delete a history photo
export async function deleteHistoryPhoto(id: string) {
  const path = `history_photos/${id}`;
  try {
    await deleteDoc(doc(db, "history_photos", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// Seed initial default database content
export async function seedInitialData() {
  try {
    // Seed Site Config
    await saveSiteConfig(DEFAULT_SITE_CONFIG);

    // Seed Gallery
    for (const item of DEFAULT_GALLERY_ITEMS) {
      await saveGalleryItem(item);
    }

    // Seed History Photos
    for (const photo of DEFAULT_HISTORY_PHOTOS) {
      await saveHistoryPhoto(photo);
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}
