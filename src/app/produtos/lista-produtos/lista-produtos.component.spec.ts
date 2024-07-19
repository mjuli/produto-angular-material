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
      const tableRows = fixture.nativeElement.querySelectorAll(
        '.mat-mdc-cell.mat-column-nome'
      );
      expect(tableRows.length).toBe(2);
      expect(tableRows[0].textContent).toContain('Produto A');
      expect(tableRows[1].textContent).toContain('Produto B');
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
