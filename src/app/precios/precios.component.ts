import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { Precio } from '../models/precio';
@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent implements OnInit {
  formularioPrecio: FormGroup;
  precios: Precio[] = new Array<Precio>();

  esEditar: boolean = false;
  id: string = '';
  constructor(private fb: FormBuilder, private db: AngularFirestore) { }

  ngOnInit() {
    this.cracionDeFormulario();

    this.traerPrecios();
  }


  cracionDeFormulario() {
    this.formularioPrecio = this.fb.group({
      nombre: ['', Validators.required],
      costo: ['', Validators.required],
      duracion: ['', Validators.required],
      tipoDuracion: ['', Validators.required]
    });
  }

  agregar() {
    this.db.collection<Precio>('precios').add(this.formularioPrecio.value).then(() => {
      Swal.fire({
        title: 'Agregado',
        text: 'Se agrego correctamente el precio ' + this.formularioPrecio.value.nombre,
        icon: 'success'
      });
      this.formularioPrecio.reset();
      this.traerPrecios();
    }).catch(() => {
      Swal.fire({
        title: 'Error en la peticion ',
        text: 'Ocurrio un error y no se pudo agregar correctamente el precio ' + this.formularioPrecio.value.nombre,
        icon: 'error'
      });
    });

  }

  editar() {
    this.db.doc<Precio>('precios/' + this.id).update(this.formularioPrecio.value).then((res) => {
      Swal.fire({
        title: 'Editado',
        text: 'Se edito correctamente el precio ' + this.formularioPrecio.value.nombre,
        icon: 'success'
      });
      this.formularioPrecio.reset();
      this.esEditar = false;
      this.traerPrecios();
    }).catch((err) => {
      Swal.fire({
        title: 'Error al editar',
        text: 'No se pudo editar el precio ' + this.formularioPrecio.value.nombre,
        icon: 'error'
      });

     });
  }


  traerPrecios() {

    this.db.collection<Precio>('precios').get().subscribe((payload) => {
      this.precios.length = 0;
      payload.docs.forEach((docs) => {
        let precioRef = docs.data() as Precio;
        precioRef.id = docs.id;
        precioRef.ref = docs.ref;
        this.precios.push(precioRef);
        
      });
    });
  }

  cargarDatosFormulario(precio: Precio) {
    this.esEditar = true;
    this.formularioPrecio.setValue({
      nombre: precio.nombre,
      costo: precio.costo,
      duracion: precio.duracion,
      tipoDuracion: precio.tipoDuracion
    });
    this.id = precio.id;
  }
}
