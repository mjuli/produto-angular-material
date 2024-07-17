import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Produto } from '../model/produto';
import { ProdutosService } from '../service/produtos.service';
import { OnDeleteDialog } from './dialog/on-delete-dialog';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [
    MatTableModule,
    AsyncPipe,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatPaginatorModule,
  ],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.scss',
})
export class ListaProdutosComponent {
  produtos$: Observable<Produto[]>;
  displayedColumns = ['nome', 'descricao', 'acao'];
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Produto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: ProdutosService,
    public snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.produtos$ = service.list().pipe(
      catchError((error) => {
        console.error(error);
        this.onError(error.message, '');
        return of([]);
      })
    );

    this.updateList();
  }

  onError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  onDelete(idProduto: number) {
    console.log('id enviado: ' + idProduto);
    const dialogRef = this.dialog.open(OnDeleteDialog, {
      data: { id: idProduto },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.updateList();
    });
  }

  onEdit(id: number) {
    this.produtos$.subscribe((produtos) => {
      const produto = produtos.find((p) => p.id === id);
      this.router.navigate([`${id}/edit`], {
        queryParams: produto,
        relativeTo: this.activatedRoute,
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.dataSource.paginator = this.paginator;
  }

  updateList() {
    this.produtos$ = this.service.list();
    this.produtos$.subscribe((produtos) => {
      this.dataSource.data = produtos;
      this.dataSource.paginator = this.paginator;
    });
  }
}
