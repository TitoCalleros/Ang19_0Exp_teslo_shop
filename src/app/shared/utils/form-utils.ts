import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

async function sleep() {
  return new Promise( resolve => {
    setTimeout(() => {
      resolve(true);
    }, 2500);

  });
}


export class FormUtils {

  // Expresiones regulares
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static isValidField( form: FormGroup, fieldName: string ): boolean | null {
    return (form.controls[fieldName].errors && form.controls[fieldName].touched);
  }

  static getFieldError( form: FormGroup, fieldName: string, errorMessage: string = '' ): string | null {
    if ( !form.controls[fieldName] ) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.processErrors(errors, errorMessage);
  }

  static isValidFieldInArray( formArray: FormArray, index: number): boolean | null {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  static getFieldErrorInArray( formArray: FormArray, index: number ): string | null {
    if ( !formArray.controls[index] ) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.processErrors(errors);
  }

  static areFieldsValueEqual(field1: string, field2: string) {
    return ( formGroup: AbstractControl ) => {

      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { notEqual: true };
    };
  }

  static async checkingServerResponse( control: AbstractControl ): Promise<ValidationErrors | null> {

    console.log('Validando en servidor');


    await sleep();

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return { emailTaken: true };
    }

    return null;
  }

  static checkingUsername( control: AbstractControl ): ValidationErrors | null {

    const formValue = control.value;

    if (formValue === 'straider') {
      return { usernameTaken: true };
    }

    return null;
  }


  private static processErrors(errors: ValidationErrors, errorMessage: string = ''): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return 'El formato de email no es válido';

        case 'pattern':
          if ( errors['pattern'].requiredPattern === FormUtils.emailPattern ) {
            return 'El valor ingresado no parece un corro electrónico';
          }
          return 'Error de patrón contra expresión regular';

        case 'emailTaken':
          return 'El email ya esta en uso';

          case 'usernameTaken':
            return 'El username ya esta en uso';

        default:
          return errorMessage.length === 0 ? `Error de validación no controlado (${key})` : errorMessage;
      }
    }

    return null;
  }
}
