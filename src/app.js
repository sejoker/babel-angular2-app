import { NgModule, Component, Input, Attribute } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import 'rxjs/add/operator/map';
import {
  applyMiddleware,
  Store,
  combineReducers,
  compose,
  createStore
} from 'redux';
import { NgRedux, select } from 'ng2-redux';
import createLogger from 'redux-logger';
import { rootReducer } from './reducers';
import { CounterActions } from './actions/counterActions';

import { Greeter } from './services';

@Component({
  selector: 'hello',
  template: '<p>{{ message }}</p>',
})
export class Hello {
  constructor(greeter: Greeter) {
    this.message = greeter.say('hello', 'Angular 2');
  }
}

@Component({
  selector: 'ciao',
  template: '<p>{{ message$ | async }}</p>',
})
export class Ciao {
  constructor(greeter: Greeter, route: ActivatedRoute) {
    this.message$ = route.params
      .map(params => greeter.say('ciao', params.name));
  }
}

@Component({
  selector: 'linker',
  template: '<p><a [href]="url" [title]="name">{{ name }}</a></p>',
})
export class Linker {
  @Input() url;

  constructor(@Attribute('name') name) {
    this.name = name;
  }
}

@Component({
  selector: 'counter',
  providers: [ CounterActions],
  template: `
  <p>
    Clicked: {{ counter$ | async }} times
    <button (click)="actions.increment()">+</button>
    <button (click)="actions.decrement()">-</button>
    <button (click)="actions.incrementIfOdd()">Increment if odd</button>
    <button (click)="actions.incrementAsync(2222)">Increment async</button>
  </p>
  `
})
export class Counter {
  @select('counter') counter$: Observable<number>;

  constructor(actions: CounterActions) {
    this.actions = actions;
  }
}

@Component({
  selector: 'hello-app',
  template: `
    <ul>
      <li><a [routerLink]="['/']">Hello</a></li>
      <li><a [routerLink]="['/ciao', 'ng2']">Ciao</a></li>
      <li><a [routerLink]="['/counter']">Counter</a></li>
    </ul>
    <router-outlet></router-outlet>
    <linker name="GitHub" url="https://github.com/shuhei/babel-angular2-app"></linker>
  `,
})
export class HelloApp {
}

const routing = RouterModule.forRoot([
  { path: '', component: Hello },
  { path: 'ciao/:name', component: Ciao },
  { path: 'counter', component: Counter },
]);

@NgModule({
  imports: [
    BrowserModule,
    routing,
  ],
  declarations: [
    HelloApp,
    Hello,
    Ciao,
    Linker,
    Counter
  ],
  providers: [
    NgRedux,
    Greeter,
    CounterActions,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [HelloApp],
})
export class AppModule {
  constructor(ngRedux: NgRedux) {
    ngRedux.configureStore(rootReducer, {}, [ createLogger() ]);
  }
}

// const store = createStore(
//  //rootReducer,
//  function() {},
//  compose(applyMiddleware(reduxLogger)));
