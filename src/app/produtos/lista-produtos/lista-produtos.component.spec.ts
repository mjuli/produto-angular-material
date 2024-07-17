import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutosService } from '../service/produtos.service';

import { ListaProdutosComponent } from './lista-produtos.component';
import { RouterModule } from '@angular/router';

describe('ListaProdutosComponent', () => {
  let component: ListaProdutosComponent;
  let fixture: ComponentFixture<ListaProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListaProdutosComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [ProdutosService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')?.textContent).toContain(
      'Listagem de Produto'
    );
  });
});
