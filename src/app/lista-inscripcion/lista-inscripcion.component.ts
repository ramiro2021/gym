import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Inscripcion } from '../models/inscripcion';

@Component({
  selector: 'app-lista-inscripcion',
  templateUrl: './lista-inscripcion.component.html',
  styleUrls: ['./lista-inscripcion.component.scss']
})
export class ListaInscripcionComponent implements OnInit {
  inscripciones: any[] = [];
  constructor(private db: AngularFirestore) { }

  ngOnInit() {

    this.db.collection('inscripciones').get().subscribe((res) => {
      this.inscripciones.length = 0;
      res.forEach((inscripcion) => {
        // tslint:disable-next-line: prefer-const
        let inscripcionObtenida = inscripcion.data();
        inscripcionObtenida.id = inscripcion.id;

        this.db.doc(inscripcion.data().cliente.path).get().subscribe((cliente) => {
          inscripcionObtenida.clienteObtenido = cliente.data();
          inscripcionObtenida.fecha= new Date(inscripcionObtenida.fecha.seconds * 1000);
          inscripcionObtenida.fechaFinal= new Date(inscripcionObtenida.fechaFinal.seconds * 1000);
          this.inscripciones.push(inscripcionObtenida);
        });
      })
    });
  }

}
