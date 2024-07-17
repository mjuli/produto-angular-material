import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutosService } from '../service/produtos.service';

import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Produto } from '../model/produto';
import { ListaProdutosComponent } from './lista-produtos.component';

describe('ListaProdutosComponent', () => {
  let component: ListaProdutosComponent;
  let fixture: ComponentFixture<ListaProdutosComponent>;
  let produtoService: ProdutosService;
  let mockProdutos: Produto[];

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
    produtoService = TestBed.inject(ProdutosService);
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

  it('should fetch products on initialization', () => {
    spyOn(produtoService, 'list').and.returnValue(of(mockProdutos));

    component.produtos$.subscribe((res) => {
      expect(res).toEqual(mockProdutos);
    });
  });

  it('should display products in the template', () => {
    spyOn(produtoService, 'list').and.returnValue(of(mockProdutos)); // Espionar o método getProdutos do serviço e retornar um Observable mockado

    fixture.detectChanges(); // Atualizar a detecção de mudanças após configurar o spy

    const productElements =
      fixture.nativeElement.querySelectorAll('.product-item'); // Selecionar elementos que representam os produtos na interface

    expect(productElements.length).toBe(mockProdutos.length); // Verificar se o número de elementos exibidos corresponde ao número de produtos mockados
    expect(productElements[0].textContent).toContain(mockProdutos[0].nome); // Verificar se o nome do primeiro produto está presente na interface
    expect(productElements[1].textContent).toContain(mockProdutos[1].nome); // Verificar se o nome do segundo produto está presente na interface
  });

  it('should handle errors when fetching products', () => {
    const errorMessage = 'Error fetching products';
    spyOn(produtoService, 'list').and.returnValue(
      throwError({ message: errorMessage })
    );

    // component.produtos$.subscribe((res) => {
    //   expect(res).toEqual(mockProdutos);
    // });
    expect(component.produtos$).toBeUndefined(); // Verificar se a lista de produtos está indefinida devido ao erro
    // expect(component.errorMsg).toBe(errorMessage); // Verificar se a mensagem de erro foi definida corretamente
  });
});
