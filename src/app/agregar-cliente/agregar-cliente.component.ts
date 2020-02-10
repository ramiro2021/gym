import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import  Swal  from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {
  // creamos un formulario para el cliente de tipo formGroup
  formularioCliente: FormGroup;
  // variable para mostrar progressbar en template
  porcentajeImg: number = 0;

  

  urlImagen: string = '';
  // inyectamos el creador de formularios

  esEditable: boolean = false;

  id: string

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private activeRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // se crea el formulario
    this.creacionFormularioNuevo();

    this.id = this.activeRoute.snapshot.params.clienteID;
    // si tenemos el id de un cliente
    if (this.id != undefined) {
      this.esEditable = true;
      // se le asignan los valores del cliente si es un caso de update
      this.creacionFormularioUpdate();
    }

  }

  creacionFormularioNuevo() {
    // creamos el formulario y se lo asignamos a formularioCliente para usarlo en el template
    this.formularioCliente = this.fb.group({
      // le damos un valor inicial el cual es vacio y le agregamos sus validaciones
      // en su mayoria la unica validacion que tienen es que sea requerido y en el email la validacion es 
      // que cumpla con el formato email asdasdasd@asdasdasd.com
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([Validators.required, Validators.email])],
      dni: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      rutina: [''],
      imgUrl: ['', Validators.required]
    });
  }

  creacionFormularioUpdate() {

    // utilizamos el documento de clientes + el id 
    this.db.doc<any>('clientes/' + this.id).valueChanges().subscribe((cliente) => {
      console.log(cliente);
      // traemos todos sus valores y lo seteamos dentro del formulario
      this.formularioCliente.setValue({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        correo: cliente.correo,
        dni: cliente.dni,
        // la fecha de nacimiento esta en otro formato por eso tenemos q multiplicar sus segundos y 
        // borrar del 0 al 10 por q esta en formato 1996-05-12 (para recordarlo hacer un consol.log de la fecha.seconds*1000)
        fechaNacimiento: new Date(cliente.fechaNacimiento.seconds * 1000).toISOString().substr(0, 10),
        telefono: cliente.telefono,
        rutina: cliente.rutina,
        imgUrl: ''
      });
      this.urlImagen = cliente.imgUrl;
    });
  }

  agregar() {
    // le asignamos la url del evento del metodo subirImagen() a imgUrl del formulario
    this.formularioCliente.value.imgUrl = this.urlImagen;
    // pasamos el string a fecha
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    // le enviamos el valor del formulario a la colleccion de clientes en fb
    this.db.collection('clientes').add(this.formularioCliente.value).then((termino) => {
     
      Swal.fire({
        title: 'Agregado',
        text: 'Se agrego correctamente el usuario '+ this.formularioCliente.value.nombre ,
        icon: 'success'
      });
      this.formularioCliente.reset();
      console.log('cliente agregado', termino);
    }).catch((error) => {
      Swal.fire({
        title: 'Agregado',
        text: 'Se agrego Correctamente',
        icon: 'error'
      });
      
    });
  }
  subirImagen(evento) {

    if (evento.target.files.length > 0) {
      //  le asignamos a la variable nombre el tiempo de la imagen
      let nombre = new Date().getTime().toString();
      // traemos el evento la imagen 0
      let archivo = evento.target.files[0];

      // borramos todo el nombre de la imagen q esta antes del . para saber si es jpg o png
      let extension = archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'));

      // a la ruta le concatenamos el nombre y la extension de la imagen para q se guarde en la carpeta 
      // clientes de storage en fb
      let ruta = 'clientes/' + nombre + extension;

      // le asignamos la ruta a storage
      const referencia = this.storage.ref(ruta);
      // le enviamos el archivo a storage
      const tarea = referencia.put(archivo);
      // esperamos a que finalice tarea y obtenemos la url con
      // getDownloadURL()
      tarea.then((resolve) => {
        console.log('img subida satisfactoriamente')
        referencia.getDownloadURL().subscribe((url) => {
          // obtenemos la url y se la asignamos a una variable local para usarla en el metodo agregar()
          this.urlImagen = url;
        });
      });
      // utilizamos el percentageChanges para asignarselo a la variable y poder mostrarlo en la progress bar
      // de el template
      tarea.percentageChanges().subscribe((porcentaje) => {
        this.porcentajeImg = porcentaje;
      });
    }


  }

  editar() {
    // le asignamos la url del evento del metodo subirImagen() a imgUrl del formulario
    this.formularioCliente.value.imgUrl = this.urlImagen;
    // pasamos el string a fecha
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);


    this.db.doc('clientes/' + this.id).update(this.formularioCliente.value).then(() => {
      // si todo sale bien mostramos un mensaje por pantalla 
      Swal.fire({
        title: 'Editado',
        text: 'Se edito correctamente el cliente ' + this.formularioCliente.value.nombre,
        icon: 'success'
      });
      // y lo redireccionamos a la pagina listado-clientes donde ya deberia estar editado el cliente
      this.router.navigate(['/listado-clientes']);

    });
  }
}
