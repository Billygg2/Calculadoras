import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './simple.html',
  styleUrls: ['./simple.css'],
})
export class Simple {
  capital: number | null = null;
  tasa: number | null = null;
  tiempo: number | null = null;
  tiempoUnidad: string = 'años';
  interes: number | null = null;
  monto: number | null = null;

  incognita: string = 'interes';
  
  respuestaEstudiante: number | null = null;
  formulaEstudiante: string = '';
  mostrarEvaluacion: boolean = false;
  esCorrecto: boolean = false;
  mensajeEvaluacion: string = '';
  resultadoCorrecto: number = 0;
  procesoCalculo: string[] = [];
  modoFormula: string = 'manual'; // 'manual' o 'automatico'

  formulasPredefinidas: any = {
    'capital': 'C = I / (i × n)',
    'tasa': 'i = I / (C × n)',
    'tiempo': 'n = I / (C × i)',
    'interes': 'I = C × i × n',
    'monto': 'M = C × (1 + i × n)',
  };

  // Bloquear letras y notación científica en inputs numéricos
  blockInvalidKeys(event: KeyboardEvent) {
    const invalidKeys = ['e', 'E', '+'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  // CORRECCIÓN: Debes DIVIDIR no multiplicar (comentario tuyo, dejo la lógica como la tienes)
  private convertirTiempoAAños(tiempo: number, unidad: string): number {
    switch (unidad) {
      case 'dias':
        return tiempo * 365;
      case 'meses':
        return tiempo * 12;
      case 'años':
        return tiempo;
      default:
        return tiempo;
    }
  }

  private getTiempoEnAnios(): number {
    if (this.tiempo === null) return 0;
    return this.convertirTiempoAAños(this.tiempo, this.tiempoUnidad);
  }

  private calcularResultadoCorrecto(): {resultado: number, proceso: string[]} {
    const C = Number(this.capital);
    const tasaDecimal = Number(this.tasa) / 100;
    const n = this.getTiempoEnAnios();
    const I = Number(this.interes);
    const M = Number(this.monto);

    let resultado = 0;
    let proceso: string[] = [];

    switch (this.incognita) {
      case 'capital':
        proceso.push('C = I / (i × n)');
        proceso.push(`C = ${I} / (${tasaDecimal} × ${n})`);
        proceso.push(`C = ${I} / ${(tasaDecimal * n).toFixed(4)}`);
        resultado = I / (tasaDecimal * n);
        proceso.push(`C = ${resultado.toFixed(2)}`);
        break;

      case 'tasa':
        proceso.push('i = I / (C × n)');
        proceso.push(`i = ${I} / (${C} × ${n})`);
        proceso.push(`i = ${I} / ${(C * n).toFixed(2)}`);
        const tasaCalculo = I / (C * n);
        proceso.push(`i = ${tasaCalculo.toFixed(4)}`);
        resultado = tasaCalculo * 100;
        proceso.push(`i = ${resultado.toFixed(2)}%`);
        break;

      case 'tiempo':
        proceso.push('n = I / (C × i)');
        proceso.push(`n = ${I} / (${C} × ${tasaDecimal})`);
        proceso.push(`n = ${I} / ${(C * tasaDecimal).toFixed(4)}`);
        const tiempoAnios = I / (C * tasaDecimal);
        proceso.push(`n = ${tiempoAnios.toFixed(4)} años`);
        
        switch (this.tiempoUnidad) {
          case 'dias':
            resultado = tiempoAnios * 365;
            proceso.push(`n = ${tiempoAnios.toFixed(4)} × 365`);
            proceso.push(`n = ${resultado.toFixed(2)} días`);
            break;
          case 'meses':
            resultado = tiempoAnios * 12;
            proceso.push(`n = ${tiempoAnios.toFixed(4)} × 12`);
            proceso.push(`n = ${resultado.toFixed(2)} meses`);
            break;
          case 'años':
            resultado = tiempoAnios;
            proceso.push(`n = ${resultado.toFixed(2)} años`);
            break;
        }
        break;

      case 'interes':
        proceso.push('I = C × i × n');
        proceso.push(`I = ${C} × ${tasaDecimal} × ${n}`);
        proceso.push(`I = ${C} × ${(tasaDecimal * n).toFixed(4)}`);
        resultado = C * tasaDecimal * n;
        proceso.push(`I = ${resultado.toFixed(2)}`);
        break;

      case 'monto':
        proceso.push('M = C × (1 + i × n)');
        proceso.push(`M = ${C} × (1 + ${tasaDecimal} × ${n})`);
        proceso.push(`M = ${C} × (1 + ${(tasaDecimal * n).toFixed(4)})`);
        proceso.push(`M = ${C} × ${(1 + tasaDecimal * n).toFixed(4)}`);
        resultado = C * (1 + tasaDecimal * n);
        proceso.push(`M = ${resultado.toFixed(2)}`);
        break;
    }

    resultado = Math.round((resultado + Number.EPSILON) * 100) / 100;
    return { resultado, proceso };
  }

  private validarCampos(): boolean {
    const faltan: string[] = [];
    const positivo = (v: any) => v !== null && v !== undefined && !isNaN(v) && Number(v) > 0;

    switch (this.incognita) {
      case 'capital':
        if (!positivo(this.interes)) faltan.push('Interés (I)');
        if (!positivo(this.tasa)) faltan.push('Tasa de interés (i)');
        if (!positivo(this.tiempo)) faltan.push('Tiempo (n)');
        break;
      case 'tasa':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.interes)) faltan.push('Interés (I)');
        if (!positivo(this.tiempo)) faltan.push('Tiempo (n)');
        break;
      case 'tiempo':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.tasa)) faltan.push('Tasa de interés (i)');
        if (!positivo(this.interes)) faltan.push('Interés (I)');
        break;
      case 'interes':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.tasa)) faltan.push('Tasa de interés (i)');
        if (!positivo(this.tiempo)) faltan.push('Tiempo (n)');
        break;
      case 'monto':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.tasa)) faltan.push('Tasa de interés (i)');
        if (!positivo(this.tiempo)) faltan.push('Tiempo (n)');
        break;
    }

    if (faltan.length > 0) {
      alert(`Por favor complete: ${faltan.join(', ')}`);
      return false;
    }

    if (!this.formulaEstudiante) {
      alert('Por favor ingrese la fórmula que va a utilizar');
      return false;
    }

    if (this.respuestaEstudiante === null || isNaN(Number(this.respuestaEstudiante))) {
      alert('Por favor ingrese su respuesta');
      return false;
    }

    return true;
  }

  cambiarModoFormula() {
    if (this.modoFormula === 'automatico') {
      this.formulaEstudiante = this.formulasPredefinidas[this.incognita];
    } else {
      this.formulaEstudiante = '';
    }
  }

  onIncognitaChange() {
    this.respuestaEstudiante = null;
    this.mostrarEvaluacion = false;
    
    if (this.modoFormula === 'automatico') {
      this.formulaEstudiante = this.formulasPredefinidas[this.incognita];
    }
  }

  evaluarRespuesta() {
    if (!this.validarCampos()) return;

    const calculo = this.calcularResultadoCorrecto();
    this.resultadoCorrecto = calculo.resultado;
    this.procesoCalculo = calculo.proceso;
    
    const respuestaUsuario = Number(this.respuestaEstudiante);
    const tolerancia = 0.01;

    this.esCorrecto = Math.abs(respuestaUsuario - this.resultadoCorrecto) <= tolerancia;

    const formulaCorrecta = this.formulasPredefinidas[this.incognita];
    const formulaEsCorrecta = this.formulaEstudiante.trim() === formulaCorrecta;

    if (this.esCorrecto && formulaEsCorrecta) {
      this.mensajeEvaluacion = '✅ ¡Excelente! Tanto la fórmula como el resultado son correctos.';
    } else if (this.esCorrecto && !formulaEsCorrecta) {
      this.mensajeEvaluacion = '⚠️ El resultado es correcto, pero la fórmula no coincide.';
    } else if (!this.esCorrecto && formulaEsCorrecta) {
      this.mensajeEvaluacion = '⚠️ La fórmula es correcta, pero el resultado no.';
    } else {
      this.mensajeEvaluacion = '❌ Tanto la fórmula como el resultado son incorrectos.';
    }

    this.mostrarEvaluacion = true;
  }

  reset() {
    this.capital = null;
    this.tasa = null;
    this.tiempo = null;
    this.tiempoUnidad = 'años';
    this.interes = null;
    this.monto = null;
    this.respuestaEstudiante = null;
    this.formulaEstudiante = '';
    this.mostrarEvaluacion = false;
    this.incognita = 'interes';
    this.modoFormula = 'manual';
  }

  getIncognitaLabel(): string {
    const labels: any = {
      'capital': 'Capital (C)',
      'tasa': 'Tasa de Interés (i) %',
      'tiempo': 'Tiempo (n)',
      'interes': 'Interés (I)',
      'monto': 'Monto (M)',
    };
    return labels[this.incognita];
  }

  getTiempoUnidadLabel(): string {
    switch (this.tiempoUnidad) {
      case 'dias': return 'días';
      case 'meses': return 'meses';
      case 'años': return 'años';
      default: return 'años';
    }
  }

  getFormulaCorrecta(): string {
    return this.formulasPredefinidas[this.incognita];
  }
}
