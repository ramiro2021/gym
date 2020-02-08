import { Component } from '@angular/core';
import { auth, User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Gym';
  usuario: User;
  cargando: boolean = true;
  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.user.subscribe((usuario) => {
      setTimeout(()=>{
        this.usuario = usuario;
        this.cargando = false;
      }, 2000);
 
    });
   }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword('ramiromurua@gmail.com', '123456789');
  }
  logout(){
    this.afAuth.auth.signOut();
  }
}
