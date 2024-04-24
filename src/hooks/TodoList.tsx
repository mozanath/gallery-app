
import {
  IonActionSheet,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRippleEffect,
  IonRow,
  } from "@ionic/react";
  import { pencilOutline, trashOutline } from "ionicons/icons";
  import { useState } from "react";
  const mockTodos = [
  {
  id: 1,
  title: "My Todo App",
  description: "This is my todo",
  },
  {
  id: 2,
  title: "My 2nd Todo App",
  description: "This is my 2nd todo description",
  },
  ];
  export const TodoList: React.FC = () => {
  const [openActionSheet, setOpenActionSheet] = useState(false);
  return (
  <IonGrid className="ion-padding">
  <IonRow>
  {mockTodos.map((todo) => {
  return (
  <IonCol size="12" className="ion-margin-bottom">
  <IonCard
  className="ion-no-margin ion-activatable"
  onClick={() => setOpenActionSheet(true)}
  >
  <IonRippleEffect></IonRippleEffect>
  <IonCardHeader>
  <IonCardTitle>{todo.title}</IonCardTitle>
  </IonCardHeader>
  <IonCardContent>{todo.description}</IonCardContent>
  </IonCard>
  </IonCol>
  );
  })}
  </IonRow>
  <IonActionSheet
  isOpen={openActionSheet}
  header="Action"
  buttons={[
  {
  text: "Delete",
  role: "destructive",
  icon: trashOutline,
  data: {
      action: "delete",
},
},
{
text: "Edit",
icon: pencilOutline,
data: {
action: "edit",
},
},
{
text: "Cancel",
role: "cancel",
data: {
action: "cancel",
},
},
]}
onWillDismiss={() => setOpenActionSheet(false)}
></IonActionSheet>
</IonGrid>
);
};