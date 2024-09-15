import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tile } from './Models/Tile';
import { connect } from 'rxjs';

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
  tileId: number = 0;
  tilePositions: Array<Tile> = [];
  position: number = 0;


  ngOnInit() {
    this.redrawCanvas();
    window.addEventListener('resize', () => {
      this.redrawCanvas();
      if (this.isRed) {
        this.ctx.fillStyle = "red";
      } else {
        this.ctx.fillStyle = "yellow";
      }
      this.ctx.fillRect(this.initialPosition, this.lineThickness, this.tileWidth, this.tileHeigth);
    });
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.initialPosition, this.lineThickness, this.tileWidth, this.tileHeigth);
    window.addEventListener('keypress', e => {
      if (this.isRed) {
        this.ctx.fillStyle = "red";
      } else {
        this.ctx.fillStyle = "yellow";
      }
      switch (e.code) {
        case 'KeyD':
          if (this.position < 6) {
            this.position++;
            //this.ctx.clearRect(this.initialPosition - this.lineThickness, this.lineThickness, this.tileWidth + this.lineThickness * 2, this.tileHeigth * 2);
            this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
            this.redrawCanvas();
            this.ctx.fillRect(this.initialPosition + this.horzSpace, this.lineThickness, this.tileWidth, this.tileHeigth);
            this.initialPosition += this.horzSpace;
          }
          break;
        case 'KeyA':
          if (this.position > 0) {
            this.position--;
            //this.ctx.clearRect(this.initialPosition - this.lineThickness, this.lineThickness, this.tileWidth + this.lineThickness * 2, this.tileHeigth * 2);
            this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
            this.redrawCanvas();
            this.ctx.fillRect(this.initialPosition - this.horzSpace, this.lineThickness, this.tileWidth, this.tileHeigth);
            this.initialPosition -= this.horzSpace;
          }
          break;
        case 'Enter':
          this.moveDown(this.tileId);
          this.tileId++;
          this.ctx.fillRect(this.initialPosition, this.lineThickness, this.tileWidth, this.tileHeigth);
          break;
      }
    });
  }
  private redrawCanvas() {
    this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.dimensions.x;
    this.canvas.height = this.dimensions.y;

    this.canvas.style.width = window.innerWidth - this.canvas.offsetTop + 'px';
    this.canvas.style.height = window.innerHeight / 1.2 - this.canvas.offsetTop + 'px';

    for (let i = 0; i < this.tilePositions.length; i++) {
      if (this.tilePositions[i].isRed) {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.tilePositions[i].x, this.tilePositions[i].y - this.lineThickness, this.tileWidth, this.tileHeigth);
      } else {
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(this.tilePositions[i].x, this.tilePositions[i].y - this.lineThickness, this.tileWidth, this.tileHeigth);
      }
    }

    this.drawBoard();
  }

  private drawBoard() {

    this.ctx.fillStyle = "lightgray";
    for (let i = 0; i < this.vertLine; i++) {
      this.ctx.fillRect(this.dimensions.x / this.vertLine * i + 20, this.tileHeigth + this.lineThickness, this.lineThickness, this.dimensions.y - this.dimensions.y / this.vertLine - 20);
    }

    for (let i = 0; i < this.horzLine; i++) {
      this.ctx.fillRect(20, this.dimensions.y / this.horzLine * (i + 1) + this.tileHeigth, this.dimensions.x - this.dimensions.x / this.vertLine + this.lineThickness, this.lineThickness);
    }

    if (this.isRed) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "yellow";
    }

  }

  private moveDown(tileId: number) {
    let height: number = 0;

    const values = this.tilePositions.filter(item => item.x == this.initialPosition);
    const yVals = values.map(obj => obj.y);
    const maxY = Math.min(...yVals);
    if (maxY == this.vertSpace + this.lineThickness) {
      return;
    }

    if (this.isRed) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "yellow";
    }

    for (let i = 1; i < 7; i++) {
      if (maxY != height + this.lineThickness + this.vertSpace) {
        this.ctx.clearRect(this.initialPosition - this.lineThickness, height, this.tileWidth + this.lineThickness * 2, this.tileHeigth + this.lineThickness * 2);
        this.ctx.fillRect(this.initialPosition, height + this.vertSpace, this.tileWidth, this.tileHeigth);
        height += this.vertSpace;
      }
    }
    this.saveCoords(tileId, height + this.lineThickness, this.initialPosition, this.isRed, this.tilePositions);
    this.drawBoard();


    if (this.isRed) {
      this.ctx.fillStyle = "yellow";
      this.isRed = false;
    } else {
      this.ctx.fillStyle = "red";
      this.isRed = true;
    }

    if (tileId > 5) {
      this.waitForNextFrame().then(() => this.checkWin(tileId));
    }
  }

  private saveCoords(tileId: number, yVal: number, xVal: number, isRed: boolean, arr: Array<Tile>) {
    let tile = new Tile(yVal, xVal, isRed);
    arr[tileId] = tile;
  }

  private checkWin(tileId: number) {
    const row: number = this.tilePositions[tileId].x;
    const column: number = this.tilePositions[tileId].y;
    const color: boolean = this.tilePositions[tileId].isRed;

    const rowTiles = [...this.tilePositions.filter(item => item.y == column)].sort((a, b) => (a.x < b.x ? -1 : 1));
    const horzIndx = rowTiles.findIndex((obj) => obj.x == row);

    const columnTiles = this.tilePositions.filter(item => item.x == row);
    const vertIndx = columnTiles.findIndex((obj) => obj.y == column);
    const columnColors = columnTiles.map(obj => obj.isRed);

    let checkTiles: number = 3;
    let connected: number = 0;
    //Horizontal ceck
    //Don't judge I'll fix it sometime soon
    for (let i = -3; i <= checkTiles; i++) {
      if (i != 0) {
        if (horzIndx + i >= 0 && horzIndx + i < rowTiles.length && rowTiles[horzIndx + i].isRed == color) {
          if (i > -3 && horzIndx + i > 0) {
            if (rowTiles[horzIndx + i].x - rowTiles[horzIndx + i - 1].x == this.horzSpace) {
              if (i == -1 && rowTiles[horzIndx].x - rowTiles[horzIndx + i].x == this.horzSpace) {
                connected++;
                if (connected == 3) {
                  this.handleEnd(color, false);
                  break;
                }
              } else if (i != -1) {
                connected++;
                if (connected == 3) {
                  this.handleEnd(color, false);
                  break;
                }
              }
            } else {
              connected = 0;
            }
          } else {
            connected++;
            if (connected == 3) {
              this.handleEnd(color, false);
              break;
            }
          }
        } else if (/**i < 0 && **/ horzIndx + i >= 0 && horzIndx + i < rowTiles.length && rowTiles[horzIndx + i].isRed != color/** && connected > 0**/) {
          connected = 0;
        }
      }
    }

    //Vertical Check
    connected = 0;
    for (let i = 1; i <= checkTiles; i++) {
      if (vertIndx - i < columnColors.length && columnColors[vertIndx - i] == color) {
        connected++;
        if (connected == 3) {
          this.handleEnd(color, false);
          break;
        }
      }
    }

    //Diagonal Check
    //go with x/y cords instead of sorted list or else
    connected = 0;
    for (let i = -3; i <= 3; i++) {
      if (i != 0) {
        const Indx = this.tilePositions.findIndex((obj) => obj.x == row + this.horzSpace * i && obj.y == column + this.vertSpace * i);
        if (Indx != -1) {
          if (this.tilePositions[Indx].isRed == color) {
            connected++;
            if (connected == 3) {
              this.handleEnd(color, false);
              break;
            }
          } else {
            connected = 0;
          }
        } else {
          connected = 0;
        }
      }
    }

    for (let i = -3; i <= 3; i++) {
      if (i != 0) {
        const Indx = this.tilePositions.findIndex((obj) => obj.x == row - this.horzSpace * i && obj.y == column + this.vertSpace * i);
        if (Indx != -1) {
          if (this.tilePositions[Indx].isRed == color) {
            connected++;
            if (connected == 3) {
              this.handleEnd(color, false);
              break;
            }
          } else {
            connected = 0;
          }
        } else {
          connected = 0;
        }
      }
    }

    if (this.tilePositions.length == 42) {
      this.handleEnd(color, true);
    }
  }

  private handleEnd(isRed: boolean, isTie: boolean) {
    if (isTie) {
      alert("The Game is a Tie, no one Won!");
    } else {
      let color: string;
      if (isRed) {
        color = "Red";
      } else {
        color = "Yellow"
      }
      alert(color + " Won the Game!");
    }
    this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
    this.drawBoard();
    this.initialPosition = 20 + this.lineThickness;
    this.isRed = false;
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.initialPosition, this.lineThickness, this.tileWidth, this.tileHeigth);
    this.tilePositions = [];
    this.position = 0;
    this.tileId = 0;
  }

  private waitForNextFrame() {
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }
}
