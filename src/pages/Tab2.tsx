import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash } from 'ionicons/icons';
import './Tab2.css';
import { usePhotoGallery } from '../hooks/usePhotoGallery';

const Tab2: React.FC = () => {
  const { photos, takePhoto, selectedPhotos, togglePhotoSelection, deleteSelectedPhotos } = usePhotoGallery();
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg onClick={() => togglePhotoSelection(photo)} 
                style={{ border: selectedPhotos.includes(photo) ? '2px solid blue' : 'none' }} 
                src={photo.webviewPath} 
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => deleteSelectedPhotos()}>
                        <IonIcon icon={trash} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Tab2;
