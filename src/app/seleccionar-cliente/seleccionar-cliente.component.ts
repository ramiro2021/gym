import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../models/cliente';


@Component({
  selector: 'app-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrls: ['./seleccionar-cliente.component.scss']
})
export class SeleccionarClienteComponent implements OnInit {
  clientes: Cliente[] = new Array<Cliente>();
  // tslint:disable-next-line: no-input-rename
  @Input('nombre') nombre: string;
  // tslint:disable-next-line: no-output-rename
  @Output ('seleccionoCliente') seleccionoCliente = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output('canceloCliente') canceloCliente = new EventEmitter();
  constructor(private db: AngularFirestore) { }

  ngOnInit() {


    this.db.collection<any>('clientes').get().subscribe((payload) => {
      this.clientes.length = 0;
      payload.docs.forEach((docs) => {
        let cliente: any = docs.data();
        cliente.id = docs.id;
        cliente.ref = docs.ref;
        cliente.visible = false;
        this.clientes.push(cliente);
      });
    });
  }


  buscarClientes(nombre: string) {
    this.clientes.forEach((cliente) => {
      if (cliente.nombre.toLowerCase().includes(nombre.toLowerCase())) {
        cliente.visible = true;
      }
      else {
        cliente.visible = false;
      }
    });
  }


  seleccionarCliente(cliente: Cliente) {
    this.nombre = cliente.nombre + ' ' + cliente.apellido;
    // console.log (this.nombre);
    this.clientes.forEach((res) => { res.visible = false; });

    this.seleccionoCliente.emit(cliente);
  }

  cancelarCliente() {
    this.nombre = undefined;
    this.canceloCliente.emit();
  }
}
