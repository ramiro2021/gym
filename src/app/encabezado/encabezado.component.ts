import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss']
})
export class EncabezadoComponent implements OnInit {
  usuario: User;
  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.afAuth.user.subscribe((usuario) => {
      setTimeout(() => {
        this.usuario = usuario;
      }, 2000)
    });


  }
  logout(){
    this.afAuth.auth.signOut();
  }


}

