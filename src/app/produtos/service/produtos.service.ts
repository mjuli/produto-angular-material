import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../model/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private API_URL = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  list(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API_URL);
  }

  create(p: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API_URL, JSON.stringify(p));
  }

  update(id: number, p: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API_URL}/${id}`, JSON.stringify(p));
  }

  getOne(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API_URL}/${id}`);
  }

  delete(id: number): Observable<Produto> {
    return this.http.delete<Produto>(`${this.API_URL}/${id}`);
  }
}
