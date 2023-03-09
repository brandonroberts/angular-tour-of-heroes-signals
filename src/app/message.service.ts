import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages = signal<string[]>([]);

  add(message: string) {
    this.messages.mutate(messages => messages.push(message));
  }

  clear() {
    this.messages.set([]);
  }
}
