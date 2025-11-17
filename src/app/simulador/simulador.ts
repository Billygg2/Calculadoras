import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './simulador.html',
  styleUrls: ['./simulador.css'],
})
export class Simulador {

  capital: number | null = null;
  tasa: number | null = null;

  plazo: number | null = null;
  plazoUnidad: string = 'meses';

  pagosPorAnio: number | null = null;
  tipoTabla: string = '';

  mostrarTabla = false;
  cuotas: any[] = [];
  mensajeError = '';

  // Detectar cambio en la unidad del plazo
onPlazoUnidadChange() {
  if (this.plazoUnidad === 'meses') {
    this.pagosPorAnio = null;
  }
}


  private convertirPlazo(plazo: number, unidad: string): number {
    if (unidad === 'meses') return plazo / 12;
    return plazo; 
  }

  private validar(): boolean {
    const ok = (v: any) => v !== null && v > 0;

    if (!ok(this.capital)) return this.error("Ingrese un monto válido");
    if (!ok(this.tasa)) return this.error("Ingrese una tasa válida");
    if (!ok(this.plazo)) return this.error("Ingrese un plazo válido");

    if (this.plazoUnidad === 'años' && !ok(this.pagosPorAnio)) {
      return this.error("Seleccione pagos por año");
    }

    if (this.tipoTabla === '') return this.error("Seleccione tipo de tabla");

    this.mensajeError = '';
    return true;
  }

  private error(msg: string): false {
    this.mensajeError = msg;
    this.mostrarTabla = false;
    return false;
  }

  calcular() {
    if (!this.validar()) return;

    const C = Number(this.capital);
    const i = Number(this.tasa) / 100;

    const plazoAnios = this.convertirPlazo(Number(this.plazo), this.plazoUnidad);

    const m = this.plazoUnidad === 'meses' ? 12 : Number(this.pagosPorAnio);

    const totalPagos = plazoAnios * m;
    const tasaPeriodo = i / m;

    let saldo = C;
    this.cuotas = [];

    if (this.tipoTabla === 'francesa') {
      const cuota = (C * tasaPeriodo) / (1 - Math.pow(1 + tasaPeriodo, -totalPagos));

      for (let k = 1; k <= totalPagos; k++) {
        const interes = saldo * tasaPeriodo;
        const capital = cuota - interes;
        saldo -= capital;

        this.cuotas.push({
          num: k,
          cuota,
          capital,
          interes,
          saldo: Math.max(saldo, 0),
        });
      }
    }

    else {
      const capitalFijo = C / totalPagos;

      for (let k = 1; k <= totalPagos; k++) {
        const interes = saldo * tasaPeriodo;
        const cuota = capitalFijo + interes;
        saldo -= capitalFijo;

        this.cuotas.push({
          num: k,
          cuota,
          capital: capitalFijo,
          interes,
          saldo: Math.max(saldo, 0),
        });
      }
    }

    this.mostrarTabla = true;
  }

  reset() {
    this.capital = null;
    this.tasa = null;
    this.plazo = null;
    this.plazoUnidad = 'meses';
    this.pagosPorAnio = null;
    this.tipoTabla = '';
    this.cuotas = [];
    this.mostrarTabla = false;
    this.mensajeError = '';
  }
}