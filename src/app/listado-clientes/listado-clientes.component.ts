import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import  Swal  from 'sweetalert2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  clientes: any[] = new Array<any>();

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    // seteado de clientes de la db

  this.getClients();

  }


  delete(cliente){
    console.log(cliente);
    this.db.collection('clientes').doc(cliente.id).delete().then( (res)=>{
      console.log('cliente eliminado');
      this.getClients();

      Swal.fire({
        title: 'Eliminado',
        text: 'Se elimino correctamente el usuario '+ cliente.nombre ,
        icon: 'success'
      });
    }).catch( (err)=>{
      console.log(err);
      Swal.fire({
        title: 'Error',
        text: 'No se ah podido eliminar el usuario '+ cliente.nombre ,
        icon: 'error'
      });
    })
  }

  getClients(){
    this.clientes.length = 0;
    this.db.collection('clientes').get().subscribe((payload) => {
      payload.docs.forEach((docs) => {
        let cliente = docs.data();
        cliente.id = docs.id;
        cliente.ref = docs.ref;
        this.clientes.push(cliente);
      });
    });
  }

}
