import { Injectable, signal } from '@angular/core';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  heroes = signal<Hero[]>([]);
  private heroesUrl = 'http://localhost:3000/heroes';  // URL to web api

  constructor(
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getHeroes() {
    return fetch(this.heroesUrl)
      .then(res => {
        this.log('fetched heroes');
        
        return res.json();
      });
  }

  /** GET hero by id. Will 404 if id not found */
  async getHero(id: number): Promise<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return fetch(url).then(res => {
      this.log(`fetched hero id=${id}`);
      return res.json();
    });
  }

  /* GET heroes whose name contains search term */
  async searchHeroes(term: string): Promise<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return Promise.resolve([]);
    }

    return fetch(`${this.heroesUrl}?q=${term}`).then(res => {
      return res.json() as unknown as Hero[]
    });
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  async addHero(hero: Hero): Promise<Hero> {
    const response = await fetch(this.heroesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(hero)
    });
    const newHero = response.json() as unknown as Hero;

    this.log(`added hero w/ id=${newHero.id}`);

    return newHero;
  }

  /** DELETE: delete the hero from the server */
  async deleteHero(id: number): Promise<void> {
    const url = `${this.heroesUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  /** PUT: update the hero on the server */
  async updateHero(hero: Hero): Promise<any> {
    await fetch(`${this.heroesUrl}/${hero.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(hero)
    });
    this.log(`updated hero id=${hero.id}`);
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
