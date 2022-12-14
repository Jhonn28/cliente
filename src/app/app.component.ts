import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './services/user.service';

declare var $: any; //para el modal

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'paciente';
  usuarios: any = [];
  usuarioForm!: FormGroup;
  seleccionado: any;

  constructor(private _userService: UserService, private _fb: FormBuilder){
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.inicializarData();
  }

  crearFormulario(){
    this.usuarioForm = this._fb.group(
      {
        nombre: ['',[Validators.required,Validators.minLength(3)]],
        apellido: ['',[Validators.required,Validators.minLength(3)]],
        cedula: [,[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
        tipo_sangre: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(5)]],
        colesterol: [0,[Validators.required,Validators.minLength(1)]],
        glucosa: [0,[Validators.required,Validators.minLength(1)]],
        presion_arterial: [0,[Validators.required,Validators.minLength(1)]],
      }
    )
  }
  agregar(){

    if(this.usuarioForm.invalid){
      Object.values(this.usuarioForm.controls).forEach(control=>{
        control.markAllAsTouched();
      })
    return;
    }
    console.log(this.seleccionado);
    if(this.seleccionado){
      console.log("DATOS ACTUALIZO =>",this.usuarioForm.value);
      this._userService.updateUser(this.usuarioForm.value,this.seleccionado?.ide_paciente).subscribe(res=>{
        $('#exampleModal').modal('hide');
        this.usuarioForm.reset();
        this.inicializarData();
        this._userService.messageApi('EXITO',`El usuario <strong>${this.seleccionado.nombre + this.seleccionado.apellido}</strong> se actualizo correctamente`,'success');
        this.seleccionado=null;
      })
    }else{
      this._userService.addUser(this.usuarioForm.value).subscribe(res =>{
        $('#exampleModal').modal('hide');
        this.inicializarData();
        this._userService.messageApi('EXITO','El usuario se registro correctamente','success');
      });
  }
  }

  isInvalidField(campo: string){
    return (this.usuarioForm.get(campo)?.invalid && this.usuarioForm.get(campo)?.touched);
  }

  getErrorMessage(campo: string){
    let message;
    if(this.usuarioForm.get(campo)?.hasError('required')){
      message = 'Este campo es obligatorio';
    }else if(this.usuarioForm.get(campo)?.hasError('minlength')){
      const minLength = this.usuarioForm.get(campo)?.errors?.minlength.requiredLength;
      message = `Debe ingresar mínimo ${minLength} caracteres`;
    }else if(this.usuarioForm.get(campo)?.hasError('maxlength')){
      const maxLength = this.usuarioForm.get(campo)?.errors?.maxlength.requiredLength;
      message = `El numero mayor de caracteres permitido es: ${maxLength} `;
    }
    return (message);
  }

  abrirModalEditar(user: any){
    this.usuarioForm.setValue({nombre: user.nombre,apellido: user.apellido,cedula: user.cedula,tipo_sangre: user.tipo_sangre, colesterol: user.colesterol,glucosa: user.glucosa,presion_arterial: user.presion_arterial});
    this.seleccionado = user;
    console.log(this.seleccionado);
    $('#exampleModal').modal('show');
  }
  inicializarData(){
    this._userService.getAllUser().subscribe(res => {
      this.usuarios = res;
    })
  }

  eliminar(user: any){
    const message=`¿Estas seguro que desea eliminar el registro del pacienete: <strong>${user.nombre + user.apellido}</strong>?`;
    this._userService.confirmDelete(message,()=>this.aceptarEliminar(user.ide_paciente));
  }

  aceptarEliminar(ide: number){
    this._userService.deleteUser(ide).subscribe(res=>{
      this.inicializarData();
      this._userService.messageApi('EXITO',`Registro eliminado correctamente`,'success');
    });
  }
  cerrarModal(){
    $('#exampleModal').modal('hide');
    this.usuarioForm.reset();
    this.seleccionado=null;
  }

}
