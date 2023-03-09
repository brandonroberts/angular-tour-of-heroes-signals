import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Observable } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { fromObservable, fromSignal } from '../utils';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSearchComponent {
  searchTerms = signal<string>('');
  heroService = inject(HeroService);

  private heroes$: Observable<Hero[]> = fromSignal(this.searchTerms).pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),

    // switch to new search observable each time the term changes
    switchMap((term: string) => this.heroService.searchHeroes(term)),
  );

  heroes = fromObservable(this.heroes$, []);
}
