import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    NgFor,
    RouterLink
  ],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes = signal<Hero[]>([]);

  constructor(private heroService: HeroService) { }

  async ngOnInit() {
    await this.getHeroes();
  }

  async getHeroes() {
    const heroes = await this.heroService.getHeroes();
    this.heroes.set(heroes);
  }

  async add(name: string) {
    name = name.trim();
    if (!name) { return; }
    const hero = await this.heroService.addHero({ name } as Hero)
    this.heroes.mutate(heroes => heroes.push(hero));
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id);
    this.heroes.mutate(heroes => heroes.filter(h => h !== hero));
  }
}
