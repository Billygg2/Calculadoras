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
  tiempo: number | null = null; // SOLO AÑOS
  capitalizacion: number | null = null;
  interes: number | null = null;
  monto: number | null = null;

  incognita: string = 'monto';

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

  // 🔒 Bloquear letras y notación científica en inputs numéricos
  blockInvalidKeys(event: KeyboardEvent) {
    const invalidKeys = ['e', 'E', '+'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  private getTiempoEnAnios(): number {
    return this.tiempo ?? 0;
  }

  // 📊 Proceso de cálculo DETALLADO (como en simple)
  private calcularResultadoCorrecto(): { resultado: number; proceso: string[] } {
    const C = Number(this.capital);
    const tasaDecimal = Number(this.tasa) / 100;
    const n = this.getTiempoEnAnios();
    const m = Number(this.capitalizacion);
    const M = Number(this.monto);

    let resultado = 0;
    let proceso: string[] = [];

    switch (this.incognita) {

      case 'capital':
        proceso.push('C = M / (1 + i/m)^(m×n)');
        proceso.push(`C = ${M} / (1 + ${tasaDecimal}/${m})^(${m}×${n})`);
        const baseC = 1 + (tasaDecimal / m);
        const expC = m * n;
        proceso.push(`C = ${M} / (${baseC.toFixed(4)})^(${expC})`);
        const potC = Math.pow(baseC, expC);
        proceso.push(`C = ${M} / ${potC.toFixed(4)}`);
        resultado = M / potC;
        proceso.push(`C = ${resultado.toFixed(2)}`);
        break;

      case 'tasa':
        proceso.push('i = m × [(M/C)^(1/(m×n)) - 1]');
        proceso.push(`i = ${m} × [(${M}/${C})^(1/(${m}×${n})) - 1]`);
        const ratioT = M / C;
        const expT = 1 / (m * n);
        proceso.push(`i = ${m} × [${ratioT.toFixed(4)}^(1/${(m * n).toFixed(2)}) - 1]`);
        const potT = Math.pow(ratioT, expT);
        proceso.push(`i = ${m} × [${potT.toFixed(4)} - 1]`);
        const iDecimal = m * (potT - 1);
        proceso.push(`i = ${iDecimal.toFixed(4)}`);
        resultado = iDecimal * 100;
        proceso.push(`i = ${resultado.toFixed(2)}%`);
        break;

      case 'tiempo':
        proceso.push('n = [log(M/C)] / [m × log(1 + i/m)]');
        proceso.push(`n = [log(${M}/${C})] / [${m} × log(1 + ${tasaDecimal}/${m})]`);
        const ratioTiempo = M / C;
        proceso.push(`n = [log(${ratioTiempo.toFixed(4)})] / [${m} × log(1 + ${(tasaDecimal / m).toFixed(4)})]`);
        const logNum = Math.log(ratioTiempo);
        const logDen = Math.log(1 + tasaDecimal / m);
        proceso.push(`n = [${logNum.toFixed(4)}] / [${m} × ${logDen.toFixed(4)}]`);
        const denom = m * logDen;
        proceso.push(`n = ${logNum.toFixed(4)} / ${denom.toFixed(4)}`);
        resultado = logNum / denom;
        proceso.push(`n = ${resultado.toFixed(4)} años`);
        break;

      case 'monto':
        proceso.push('M = C × (1 + i/m)^(m×n)');
        proceso.push(`M = ${C} × (1 + ${tasaDecimal}/${m})^(${m}×${n})`);
        const baseM = 1 + tasaDecimal / m;
        const expM = m * n;
        proceso.push(`M = ${C} × (${baseM.toFixed(4)})^(${expM})`);
        const potM = Math.pow(baseM, expM);
        proceso.push(`M = ${C} × ${potM.toFixed(4)}`);
        resultado = C * potM;
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

  validarCampos(): boolean {
    const faltan: string[] = [];
    const ok = (v: any) => v !== null && Number(v) > 0;

    switch (this.incognita) {
      case 'capital':
        if (!ok(this.monto)) faltan.push('Monto');
        if (!ok(this.tasa)) faltan.push('Tasa');
        if (!ok(this.tiempo)) faltan.push('Tiempo');
        if (!ok(this.capitalizacion)) faltan.push('Capitalización');
        break;
      case 'tasa':
        if (!ok(this.capital)) faltan.push('Capital');
        if (!ok(this.monto)) faltan.push('Monto');
        if (!ok(this.tiempo)) faltan.push('Tiempo');
        if (!ok(this.capitalizacion)) faltan.push('Capitalización');
        break;
      case 'tiempo':
        if (!ok(this.capital)) faltan.push('Capital');
        if (!ok(this.tasa)) faltan.push('Tasa');
        if (!ok(this.monto)) faltan.push('Monto');
        if (!ok(this.capitalizacion)) faltan.push('Capitalización');
        break;
      case 'monto':
        if (!ok(this.capital)) faltan.push('Capital');
        if (!ok(this.tasa)) faltan.push('Tasa');
        if (!ok(this.tiempo)) faltan.push('Tiempo');
        if (!ok(this.capitalizacion)) faltan.push('Capitalización');
        break;
      case 'interes':
        if (!ok(this.capital)) faltan.push('Capital');
        if (!ok(this.monto)) faltan.push('Monto');
        break;
    }

    if (faltan.length > 0) {
      alert(`Faltan: ${faltan.join(', ')}`);
      return false;
    }

    if (!this.formulaEstudiante) {
      alert('Ingrese la fórmula');
      return false;
    }

    if (this.respuestaEstudiante === null) {
      alert('Ingrese su respuesta');
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

    const r = Number(this.respuestaEstudiante);
    const tol = 0.01;

    this.esCorrecto = Math.abs(r - this.resultadoCorrecto) <= tol;

    const formulaCorrecta = this.formulasPredefinidas[this.incognita];
    const formOK = this.formulaEstudiante.trim() === formulaCorrecta;

    if (this.esCorrecto && formOK)
      this.mensajeEvaluacion = '✅ ¡Excelente! Fórmula y resultado correctos.';
    else if (this.esCorrecto)
      this.mensajeEvaluacion = '⚠️ Resultado correcto pero fórmula incorrecta.';
    else if (formOK)
      this.mensajeEvaluacion = '⚠️ Fórmula correcta pero resultado incorrecto.';
    else
      this.mensajeEvaluacion = '❌ Fórmula y resultado incorrectos.';

    this.mostrarEvaluacion = true;
  }

  reset() {
    this.capital = null;
    this.tasa = null;
    this.tiempo = null;
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
      'tasa': 'Tasa (%)',
      'tiempo': 'Tiempo (años)',
      'monto': 'Monto (M)',
      'interes': 'Interés (I)',
    };
    return labels[this.incognita];
  }

  getFormulaCorrecta(): string {
    return this.formulasPredefinidas[this.incognita];
  }
}
