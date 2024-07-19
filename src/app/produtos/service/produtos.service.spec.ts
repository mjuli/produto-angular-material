import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Produto } from '../model/produto';
import { ProdutosService } from './produtos.service';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:3000/produtos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProdutosService],
    });

    service = TestBed.inject(ProdutosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products (list)', () => {
    const mockProdutos: Produto[] = [
      { id: 1, nome: 'Produto A', descricao: 'Descrição do produto A' },
      { id: 2, nome: 'Produto B', descricao: 'Descrição do produto B' },
    ];

    service.list().subscribe((produtos) => {
      expect(produtos).toEqual(mockProdutos);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockProdutos);
  });

  it('should create a product (create)', () => {
    const newProduto: Produto = {
      id: 3,
      nome: 'Produto C',
      descricao: 'Descrição do produto C',
    };

    service.create(newProduto).subscribe((produto) => {
      expect(produto).toEqual(newProduto);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(JSON.stringify(newProduto));
    req.flush(newProduto);
  });

  it('should update a product (update)', () => {
    const updatedProduto: Produto = {
      id: 1,
      nome: 'Produto A Atualizado',
      descricao: 'Descrição atualizada do produto A',
    };

    service.update(updatedProduto.id, updatedProduto).subscribe((produto) => {
      expect(produto).toEqual(updatedProduto);
    });

    const req = httpMock.expectOne(`${API_URL}/${updatedProduto.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(JSON.stringify(updatedProduto));
    req.flush(updatedProduto);
  });

  it('should fetch a single product (getOne)', () => {
    const mockProduto: Produto = {
      id: 1,
      nome: 'Produto A',
      descricao: 'Descrição do produto A',
    };

    service.getOne(mockProduto.id).subscribe((produto) => {
      expect(produto).toEqual(mockProduto);
    });

    const req = httpMock.expectOne(`${API_URL}/${mockProduto.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduto);
  });

  it('should delete a product (delete)', () => {
    const mockProduto: Produto = {
      id: 1,
      nome: 'Produto A',
      descricao: 'Descrição do produto A',
    };

    service.delete(mockProduto.id).subscribe((produto) => {
      expect(produto).toEqual(mockProduto);
    });

    const req = httpMock.expectOne(`${API_URL}/${mockProduto.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProduto);
  });
});
