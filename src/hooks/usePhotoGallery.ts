import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Capacitor } from '@capacitor/core';
import { render } from '@testing-library/react';
export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';
export async function savePicture(photo: Photo, fileName: string): Promise<UserPhoto> {
    let base64Data: string;
    if (isPlatform('hybrid')) {
        const file = Filesystem.readFile({
            path: photo.path!,
        });
        base64Data = (await file).data;
    } else {
        base64Data = await base64FromPath(photo.webPath!);
    }

    const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
    });

    if (isPlatform('hybrid')) {
        return {
            filepath: savedFile.uri,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
    } else {
        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    }
}

export function usePhotoGallery() {
    const [photos, setPhotos] = useState<UserPhoto[]>([]);
    const [selectedPhotos, setSelectedPhotos] = useState<UserPhoto[]>([]);

    const togglePhotoSelection = (photo: UserPhoto) => {
        const isSelected = selectedPhotos.some(selectedPhoto => selectedPhoto.filepath === photo.filepath);
        if (isSelected) {
            setSelectedPhotos(prevSelected => prevSelected.filter(selectedPhoto => selectedPhoto.filepath !== photo.filepath));
        } else {
            setSelectedPhotos(prevSelected => [...prevSelected, photo]);
        }
    };

    const deleteSelectedPhotos = () => {
        const confirmDelete = window.confirm("Delete selected photo(s)?");
        if (confirmDelete) {
            const remainingPhotos = photos.filter(photo => !selectedPhotos.includes(photo));
            setPhotos(remainingPhotos);
            setSelectedPhotos([]);
            Storage.set({ key: PHOTO_STORAGE, value: JSON.stringify(remainingPhotos) });
        }
    };

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(photo, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);
        Storage.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    };

    useEffect(() => {
        const loadSaved = async () => {
            const { value } = await Storage.get({ key: PHOTO_STORAGE });
            const photosInStorage = (value ? JSON.parse(value) : []) as UserPhoto[];
            if (!isPlatform('hybrid')) {
                for (let photo of photosInStorage) {
                    const file = await Filesystem.readFile({
                        path: photo.filepath,
                        directory: Directory.Data,
                    });
                    // Web platform only: Load the photo as base64 data
                    photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
                }
            }
            setPhotos(photosInStorage);
        };
        loadSaved();
    }, []);

    return {
        photos,
        takePhoto,
        selectedPhotos,
        togglePhotoSelection,
        deleteSelectedPhotos
    };
}


export async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('method did not return a string');
            }
        };
        reader.readAsDataURL(blob);
    });
}

