import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoClientesComponent } from './listado-clientes/listado-clientes.component';
import { AgregarClienteComponent } from './agregar-cliente/agregar-cliente.component';
import { PreciosComponent } from './precios/precios.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { ListaInscripcionComponent } from './lista-inscripcion/lista-inscripcion.component';


const routes: Routes = [
  { path: '' , redirectTo: 'inscripcion', pathMatch: 'full'},
  { path: 'inscripcion', component : InscripcionComponent},
  { path: 'listado-clientes', component : ListadoClientesComponent},
  { path: 'agregar-clientes', component : AgregarClienteComponent},
  { path: 'agregar-clientes/:clienteID', component : AgregarClienteComponent},
  { path: 'precios', component : PreciosComponent},
  {path: 'listadoInscripcion', component : ListaInscripcionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
