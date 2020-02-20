import { DocumentReference } from '@angular/fire/firestore';

export class Cliente{
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    dni: string;
    fechaNacimiento: Date;
    imgUrl: string;
    rutina: string;
    telefono: number;
    ref: DocumentReference;
    visible: boolean;
}