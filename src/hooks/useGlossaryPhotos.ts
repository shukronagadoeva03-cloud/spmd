import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "shugnov.glossary.photos.v1";
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.82;

type PhotoMap = Record<string, string>;

function readAll(): PhotoMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PhotoMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: PhotoMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn("glossary photos: storage quota exceeded", e);
  }
}

async function compressFile(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("image decode failed"));
    i.src = dataUrl;
  });
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export function useGlossaryPhotos() {
  const [photos, setPhotos] = useState<PhotoMap>({});

  useEffect(() => {
    setPhotos(readAll());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setPhotos(readAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setPhoto = useCallback(async (id: string, file: File) => {
    const compressed = await compressFile(file);
    setPhotos((prev) => {
      const next = { ...prev, [id]: compressed };
      writeAll(next);
      return next;
    });
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[id];
      writeAll(next);
      return next;
    });
  }, []);

  return { photos, setPhoto, removePhoto };
}