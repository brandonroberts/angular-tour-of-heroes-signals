import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    NgIf,
    UpperCasePipe,
    FormsModule
  ],
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero = signal<Hero | null>(null)!;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  async ngOnInit() {
    await this.getHero();
  }

  async getHero() {
    const hero = await this.heroService.getHero(parseInt(this.route.snapshot.paramMap.get('id')!, 10));

    this.hero.set(hero);
  }

  goBack(): void {
    this.location.back();
  }

  updateHero(name: string) {
    this.hero.mutate(hero => hero!.name = name);
  }

  async save() {
    const hero = this.hero();

    if (hero) {
      await this.heroService.updateHero(hero);
      this.goBack();
    }
  }
}
