import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compuesta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './compuesta.html',
  styleUrls: ['./compuesta.css'],
})
export class Compuesta {
  capital: number | null = null;
  tasa: number | null = null;
  tiempo: number | null = null;
  tiempoUnidad: string = 'años';
  capitalizacion: number | null = null;
  interes: number | null = null;
  monto: number | null = null;

  incognita: string = 'monto';
  
  // Propiedades para evaluación
  respuestaEstudiante: number | null = null;
  formulaEstudiante: string = '';
  mostrarEvaluacion: boolean = false;
  esCorrecto: boolean = false;
  mensajeEvaluacion: string = '';
  resultadoCorrecto: number = 0;
  procesoCalculo: string[] = [];
  modoFormula: string = 'manual';

  formulasPredefinidas: any = {
    'capital': 'C = M / (1 + i/m)^(m×n)',
    'tasa': 'i = m × [(M/C)^(1/(m×n)) - 1]',
    'tiempo': 'n = [log(M/C)] / [m × log(1 + i/m)]',
    'monto': 'M = C × (1 + i/m)^(m×n)',
    'interes': 'I = M - C',
  };

  // Convertir tiempo a años según la unidad
  private convertirTiempoAAños(tiempo: number, unidad: string): number {
    switch (unidad) {
      case 'dias':
        return tiempo / 365;
      case 'meses':
        return tiempo / 12;
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

  // Calcular el resultado correcto internamente
  private calcularResultadoCorrecto(): {resultado: number, proceso: string[]} {
    const C = Number(this.capital);
    const tasaDecimal = Number(this.tasa) / 100;
    const n = this.getTiempoEnAnios();
    const m = Number(this.capitalizacion);
    const I = Number(this.interes);
    const M = Number(this.monto);

    let resultado = 0;
    let proceso: string[] = [];

    switch (this.incognita) {
      case 'capital':
        proceso.push('C = M / (1 + i/m)^(m×n)');
        const baseCapital = 1 + (tasaDecimal / m);
        const exponenteCapital = m * n;
        proceso.push(`C = ${M} / (1 + ${tasaDecimal}/${m})^(${m}×${n})`);
        proceso.push(`C = ${M} / (${baseCapital.toFixed(4)})^(${exponenteCapital})`);
        const potenciaCapital = Math.pow(baseCapital, exponenteCapital);
        proceso.push(`C = ${M} / ${potenciaCapital.toFixed(4)}`);
        resultado = M / potenciaCapital;
        proceso.push(`C = ${resultado.toFixed(2)}`);
        break;

      case 'tasa':
        proceso.push('i = m × [(M/C)^(1/(m×n)) - 1]');
        proceso.push(`i = ${m} × [(${M}/${C})^(1/(${m}×${n})) - 1]`);
        const ratioTasa = M / C;
        const exponenteTasa = 1 / (m * n);
        proceso.push(`i = ${m} × [${ratioTasa.toFixed(4)}^(1/${(m * n).toFixed(2)}) - 1]`);
        const potenciaTasa = Math.pow(ratioTasa, exponenteTasa);
        proceso.push(`i = ${m} × [${potenciaTasa.toFixed(4)} - 1]`);
        const calculoTasa = m * (potenciaTasa - 1);
        proceso.push(`i = ${calculoTasa.toFixed(4)}`);
        resultado = calculoTasa * 100;
        proceso.push(`i = ${resultado.toFixed(2)}%`);
        break;

      case 'tiempo':
        proceso.push('n = [log(M/C)] / [m × log(1 + i/m)]');
        proceso.push(`n = [log(${M}/${C})] / [${m} × log(1 + ${tasaDecimal}/${m})]`);
        const ratioTiempo = M / C;
        proceso.push(`n = [log(${ratioTiempo.toFixed(4)})] / [${m} × log(1 + ${(tasaDecimal/m).toFixed(4)})]`);
        const logNumerador = Math.log(ratioTiempo);
        const logDenominador = Math.log(1 + (tasaDecimal / m));
        proceso.push(`n = [${logNumerador.toFixed(4)}] / [${m} × ${logDenominador.toFixed(4)}]`);
        const denominadorTiempo = m * logDenominador;
        proceso.push(`n = ${logNumerador.toFixed(4)} / ${denominadorTiempo.toFixed(4)}`);
        const tiempoAnios = logNumerador / denominadorTiempo;
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

      case 'monto':
        proceso.push('M = C × (1 + i/m)^(m×n)');
        proceso.push(`M = ${C} × (1 + ${tasaDecimal}/${m})^(${m}×${n})`);
        const baseMonto = 1 + (tasaDecimal / m);
        const exponenteMonto = m * n;
        proceso.push(`M = ${C} × (${baseMonto.toFixed(4)})^(${exponenteMonto})`);
        const potenciaMonto = Math.pow(baseMonto, exponenteMonto);
        proceso.push(`M = ${C} × ${potenciaMonto.toFixed(4)}`);
        resultado = C * potenciaMonto;
        proceso.push(`M = ${resultado.toFixed(2)}`);
        break;

      case 'interes':
        proceso.push('I = M - C');
        proceso.push(`I = ${M} - ${C}`);
        resultado = M - C;
        proceso.push(`I = ${resultado.toFixed(2)}`);
        break;
    }

    resultado = Math.round((resultado + Number.EPSILON) * 100) / 100;
    return { resultado, proceso };
  }

  // Validación de campos
  private validarCampos(): boolean {
    const faltan: string[] = [];
    const positivo = (v: any) => v !== null && v !== undefined && !isNaN(v) && Number(v) > 0;

    switch (this.incognita) {
      case 'capital':
        if (!positivo(this.monto)) faltan.push('Monto (M)');
        if (!positivo(this.tasa)) faltan.push('Tasa de interés (i)');
        if (!positivo(this.tiempo)) faltan.push('Tiempo (n)');
        if (!positivo(this.capitalizacion)) faltan.push('Capitalización (m)');
        break;
      case 'tasa':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.monto)) faltan.push('Monto (M)');
        if (!positivo(this.tiempo)) faltan.push('Tiempo (n)');
        if (!positivo(this.capitalizacion)) faltan.push('Capitalización (m)');
        break;
      case 'tiempo':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.tasa)) faltan.push('Tasa de interés (i)');
        if (!positivo(this.monto)) faltan.push('Monto (M)');
        if (!positivo(this.capitalizacion)) faltan.push('Capitalización (m)');
        break;
      case 'monto':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.tasa)) faltan.push('Tasa de interés (i)');
        if (!positivo(this.tiempo)) faltan.push('Tiempo (n)');
        if (!positivo(this.capitalizacion)) faltan.push('Capitalización (m)');
        break;
      case 'interes':
        if (!positivo(this.capital)) faltan.push('Capital (C)');
        if (!positivo(this.monto)) faltan.push('Monto (M)');
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

  // Cambiar modo de fórmula
  cambiarModoFormula() {
    if (this.modoFormula === 'automatico') {
      this.formulaEstudiante = this.formulasPredefinidas[this.incognita];
    } else {
      this.formulaEstudiante = '';
    }
  }

  // Cuando cambia la incógnita
  onIncognitaChange() {
    this.respuestaEstudiante = null;
    this.mostrarEvaluacion = false;
    
    if (this.modoFormula === 'automatico') {
      this.formulaEstudiante = this.formulasPredefinidas[this.incognita];
    }
  }

  // Evaluar la respuesta del estudiante
  evaluarRespuesta() {
    if (!this.validarCampos()) return;

    const calculo = this.calcularResultadoCorrecto();
    this.resultadoCorrecto = calculo.resultado;
    this.procesoCalculo = calculo.proceso;
    
    const respuestaUsuario = Number(this.respuestaEstudiante);
    const tolerancia = 0.01;

    // Verificar si la respuesta es correcta
    this.esCorrecto = Math.abs(respuestaUsuario - this.resultadoCorrecto) <= tolerancia;

    // Verificar si la fórmula es correcta
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
    this.capitalizacion = null;
    this.interes = null;
    this.monto = null;
    this.respuestaEstudiante = null;
    this.formulaEstudiante = '';
    this.mostrarEvaluacion = false;
    this.incognita = 'monto';
    this.modoFormula = 'manual';
  }

  getIncognitaLabel(): string {
    const labels: any = {
      'capital': 'Capital (C)',
      'tasa': 'Tasa de Interés (i) %',
      'tiempo': 'Tiempo (n)',
      'monto': 'Monto (M)',
      'interes': 'Interés (I)',
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

  // Método para obtener la fórmula correcta
  getFormulaCorrecta(): string {
    return this.formulasPredefinidas[this.incognita];
  }
}