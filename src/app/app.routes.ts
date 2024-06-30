import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'produtos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./produtos/lista-produtos/lista-produtos.component').then(
            (m) => m.ListaProdutosComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./produtos/form-produtos/form-produtos.component').then(
            (m) => m.FormProdutosComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./produtos/form-produtos/form-produtos.component').then(
            (m) => m.FormProdutosComponent
          ),
      },
    ],
  },
];
