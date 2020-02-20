import { Component, OnInit } from '@angular/core';
import { Inscripcion } from '../models/inscripcion';
import { Cliente } from '../models/cliente';
import { AngularFirestore } from '@angular/fire/firestore';
import { Precio } from '../models/precio';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente = new Cliente();
  precioSeleccionado: Precio = new Precio;
  precios: Precio[] = new Array<Precio>();
  idPrecio: string = 'null';
  constructor(private db: AngularFirestore) { }

  ngOnInit() {

    this.db.collection('precios').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        const precio = item.data() as Precio;
        precio.id = item.id;
        precio.ref = item.ref;
        this.precios.push(precio);
      })
    })
  }
  asignarCliente(cliente: Cliente) {
    this.inscripcion.cliente = cliente.ref;
    this.clienteSeleccionado = cliente;
  }

  eliminarCliente() {
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.cliente = undefined;
  }

  guardar() {
    if(this.inscripcion.validar().esValido){
      let inscripcionAgregar= {
        fecha: this.inscripcion.fecha,
      fechaFinal: this.inscripcion.fechaFinal,
      cliente: this.inscripcion.cliente,
      precios: this.inscripcion.precios,
      subTotal:this.inscripcion.subTotal,
      iva: this.inscripcion.iva,
      total: this.inscripcion.total,
      }
      console.log('Guardando inscripcion...');
      this.db.collection('inscripciones').add(inscripcionAgregar).then( (resultado)=>{
        this.inscripcion = new Inscripcion();
        this.clienteSeleccionado = new Cliente();
        this.precioSeleccionado = new Precio();
        this.idPrecio= 'null';
        Swal.fire({
          title: 'Agregado',
          text: 'El cliente fue inscripto correctamente ' ,
          icon: 'success'
        });

      });
    }
    else {
      Swal.fire({
        title: 'Error',
        text: this.inscripcion.validar().mensaje ,
        icon: 'error'
      });
      console.log(this.inscripcion.validar().mensaje);
      
    }
    console.log(this.inscripcion);

  }


  seleccionarPrecio(id: string) {


    if (id != "null") {
      this.precioSeleccionado = this.precios.find(x => x.id == id);
      this.inscripcion.precios = this.precioSeleccionado.ref;
      this.inscripcion.fecha = new Date();

      this.inscripcion.subTotal = this.precioSeleccionado.costo;
      this.inscripcion.iva = this.inscripcion.subTotal * 0.21;
      this.inscripcion.total = this.inscripcion.subTotal + this.inscripcion.iva;


      if (this.precioSeleccionado.tipoDuracion == 1) {
        const dias: number = this.inscripcion.fecha.getDate() + this.precioSeleccionado.duracion;
        // tslint:disable-next-line: max-line-length
        const anio: number = this.inscripcion.fecha.getFullYear();
        const mes: number = this.inscripcion.fecha.getMonth();
        const fechaFinal = new Date(anio, mes, dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 2) {
        const dias: number = this.inscripcion.fecha.getDate() + (this.precioSeleccionado.duracion * 7);
        const anio: number = this.inscripcion.fecha.getFullYear();
        const mes: number = this.inscripcion.fecha.getMonth();
        // tslint:disable-next-line: max-line-length
        const fechaFinal = new Date(anio, mes, dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 3) {
        const dias: number = this.inscripcion.fecha.getDate() + (this.precioSeleccionado.duracion * 15);
        const anio: number = this.inscripcion.fecha.getFullYear();
        const mes: number = this.inscripcion.fecha.getMonth();
        // tslint:disable-next-line: max-line-length
        const fechaFinal = new Date(anio, mes, dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 4) {
        const dias: number = this.inscripcion.fecha.getDate();
        const anio: number = this.inscripcion.fecha.getFullYear();
        let meses = this.inscripcion.fecha.getMonth() + this.precioSeleccionado.duracion;
        // tslint:disable-next-line: max-line-length
        const fechaFinal = new Date(anio, + meses, dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 5) {
        const dias: number = this.inscripcion.fecha.getDate();
        const mes: number = this.inscripcion.fecha.getMonth();
        let anios = this.inscripcion.fecha.getFullYear() + this.precioSeleccionado.duracion;
        // tslint:disable-next-line: max-line-length
        const fechaFinal = new Date(anios, mes, dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
    } else {
      this.precioSeleccionado = new Precio();
      this.inscripcion.fecha = null;
      this.inscripcion.fechaFinal = null;
      this.inscripcion.precios = null;
      this.inscripcion.subTotal = 0;
      this.inscripcion.iva = 0;
      this.inscripcion.total = 0;
    }
  }
}
