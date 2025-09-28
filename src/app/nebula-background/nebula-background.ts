import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, HostListener, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string = '#0633B7FF';

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvasWidth + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = this.canvasWidth + this.size;
    if (this.y > this.canvasHeight + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = this.canvasHeight + this.size;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

@Component({
  selector: 'app-nebula-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nebula-background.html',
  styleUrl: './nebula-background.scss'
})
export class NebulaBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('nebulaCanvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId?: number;

  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const canvasEl = this.canvasRef.nativeElement;
      this.ctx = canvasEl.getContext('2d')!;
      this.resizeCanvas();
      this.initParticles();
      this.ngZone.runOutsideAngular(() => this.animate());
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
    this.initParticles();
  }

  private resizeCanvas(): void {
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const particleCount = (canvas.width * canvas.height) / 9000;
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(canvas.width, canvas.height));
    }
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.particles.forEach(p => {
      p.update();
      p.draw(this.ctx);
    });

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
}
