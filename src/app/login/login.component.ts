import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // formulario para logear
  formularioLogin: FormGroup;
  // variable para ngIf dentro de template
  datosCorrectos: boolean = true;
  // variable para mostrar error en el login
  textoError: string = '';
  constructor(private creadorFormulario: FormBuilder, public afAuth: AngularFireAuth, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // crear formulario para logear
    this.formularioLogin = this.creadorFormulario.group({
      // validamos el email para que sea requerido y que tenga formato de email, 
      // mientras que a la pw solamente le ponemos una validacion de requerimiento
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  ingresar() {
    // validamos que el formulario sea correcto
    if (this.formularioLogin.valid) {
      // cambiamos el estado a true para el template y ponemos a funcionar un spinner
      this.datosCorrectos = true;
      this.spinner.show();
      // iniciamos sesion por medio de angular fire auth 
      this.afAuth.auth.signInWithEmailAndPassword(this.formularioLogin.value.email, this.formularioLogin.value.password)
        .then(
          // si todo sale bien tenemos un usuario logeado y paramos el spinner
          (usuario) => {
            console.log(usuario);
            this.spinner.hide();
            // sino tenemos un error seteamos a falso la variable para el template y mostramos el erorr
            // igualmente paramos el spinner
          }).catch((error) => {
            this.datosCorrectos = false;
            this.textoError = error.message;
            this.spinner.hide();
          })
    } else {
      // si los datos del login no son validos se setea la variable a false para que 
      // logee nuevamente y le mostramos un error por Alert
      this.datosCorrectos = false;
      this.textoError = ' Porfavor revisa que los datos esten correctos... ';
    }
  }

}
