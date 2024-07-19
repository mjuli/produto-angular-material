import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutosService } from '../service/produtos.service';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Produto } from '../model/produto';
import { ListaProdutosComponent } from './lista-produtos.component';

describe('ListaProdutosComponent', () => {
  let component: ListaProdutosComponent;
  let fixture: ComponentFixture<ListaProdutosComponent>;
  let produtoService: ProdutosService;
  let mockProdutos: Produto[];
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListaProdutosComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatTableModule,
        BrowserAnimationsModule,
      ],
      providers: [ProdutosService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProdutosComponent);
    component = fixture.componentInstance;
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    produtoService = new ProdutosService(httpClientSpy);
    fixture.detectChanges();

    mockProdutos = [
      { id: 1, nome: 'Produto A', descricao: 'Descrição do produto A' },
      { id: 2, nome: 'Produto B', descricao: 'Descrição do produto B' },
    ];
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

  it('should return expected products (HttpClient called once)', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of(mockProdutos));

    produtoService.list().subscribe({
      next: (products) => {
        expect(products).withContext('expected products').toEqual(mockProdutos);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('should display products in the template', async () => {
    component.dataSource.data = mockProdutos;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const tableRowsNome =
        fixture.nativeElement.querySelectorAll('.mat-column-nome');
      expect(tableRowsNome.length).toBe(3);
      expect(tableRowsNome[0].textContent).toContain('Nome');
      expect(tableRowsNome[1].textContent).toContain('Produto A');
      expect(tableRowsNome[2].textContent).toContain('Produto B');

      const tableRowsDescricao = fixture.nativeElement.querySelectorAll(
        '.mat-column-descricao'
      );
      expect(tableRowsDescricao.length).toBe(3);
      expect(tableRowsDescricao[0].textContent).toContain('Descrição');
      expect(tableRowsDescricao[1].textContent).toContain(
        'Descrição do produto A'
      );
      expect(tableRowsDescricao[2].textContent).toContain(
        'Descrição do produto B'
      );
    });
  });

  it('should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

    produtoService.list().subscribe({
      next: () => {
        done.fail('expected an error, not products');
      },
      error: (e) => {
        expect(e.error).toContain('test 404 error');
        done();
      },
    });
  });
});
