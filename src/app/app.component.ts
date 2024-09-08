import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ConnectFour';
  canvas: any;
  ctx: any;
  dimensions = { x: window.innerWidth, y: window.innerHeight }
  lineThickness: number = 7;
  vertLine: number = 8;
  horzLine: number = 7;
  isRed: boolean = false;
  tileWidth: number = this.dimensions.x / this.vertLine - this.lineThickness;
  tileHeigth: number = this.dimensions.y / this.horzLine - this.lineThickness;
  horzSpace: number = this.tileWidth + this.lineThickness;
  vertSpace: number = this.tileHeigth + this.lineThickness;
  initialPosition: number = 20 + this.lineThickness;
  tilePositions: number[] = [];
  

  ngOnInit() {
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.initialPosition, this.lineThickness, this.tileWidth, this.tileHeigth);
    let position = 0;
    window.addEventListener('keypress', e => {
      if (this.isRed) {
        this.ctx.fillStyle = "red";
      } else {
        this.ctx.fillStyle = "yellow";
      }
      switch (e.code) {
        case 'KeyD':
          if (position < 6) {
            position++;
            this.ctx.clearRect(this.initialPosition, this.lineThickness, this.tileWidth, this.tileHeigth);
            this.ctx.fillRect(this.initialPosition + this.horzSpace, this.lineThickness, this.tileWidth, this.tileHeigth);
            this.initialPosition += this.horzSpace;
          }
          break;
        case 'KeyA':
          if (position > 0) {
            position--;
            this.ctx.clearRect(this.initialPosition, this.lineThickness, this.tileWidth, this.tileHeigth);
            this.ctx.fillRect(this.initialPosition - this.horzSpace, this.lineThickness, this.tileWidth, this.tileHeigth);
            this.initialPosition -= this.horzSpace;
          }
          break;
        case 'Enter':
          this.moveDown(position);
          if (this.isRed) {
            this.isRed = false;
          } else {
            this.isRed = true;
          }
          break;
      }
    });
  }
  private resizeCanvas() {
    this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.dimensions.x;
    this.canvas.height = this.dimensions.y;

    this.canvas.style.width = window.innerWidth - this.canvas.offsetTop + 'px';
    this.canvas.style.height = window.innerHeight / 1.2 - this.canvas.offsetTop + 'px';

    this.drawBoard();
  }

  private drawBoard() {

    this.ctx.fillStyle = "lightgray";
    for (let i = 0; i < this.vertLine; i++) {
      this.ctx.fillRect(this.dimensions.x / this.vertLine * i + 20, 0, this.lineThickness, this.dimensions.y - this.dimensions.y / this.vertLine - 20);
    }

    for (let i = 0; i < this.horzLine; i++) {
      this.ctx.fillRect(20, this.dimensions.y / this.horzLine * (i + 1), this.dimensions.x - this.dimensions.x / this.vertLine + this.lineThickness, this.lineThickness);
    }
  }

  private moveDown(column: number) {
    let height: number = this.lineThickness;
    if (this.isRed) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "yellow";
    }
    for (let i = 1; i < 6; i++) {
      if (this.tilePositions[column] != height + this.lineThickness + this.vertSpace) {
        this.ctx.clearRect(this.initialPosition, height, this.tileWidth, this.tileHeigth);
        this.ctx.fillRect(this.initialPosition, height + this.vertSpace, this.tileWidth, this.tileHeigth);
        height += this.vertSpace;
      }
    }
    this.saveCoords(column, height + this.lineThickness, this.tilePositions);
    this.drawBoard();
  }

  private saveCoords(column: number, yVal: number, arr: number[]) {
    arr[column] = yVal;
  }
}
