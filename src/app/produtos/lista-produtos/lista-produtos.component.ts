import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { Produto } from '../model/produto';
import { ProdutosService } from '../service/produtos.service';
import { OnDeleteDialog } from './dialog/on-delete-dialog';
import { MatToolbarModule } from '@angular/material/toolbar';

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
  ],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.scss',
})
export class ListaProdutosComponent {
  produtos$: Observable<Produto[]>;
  displayedColumns = ['nome', 'descricao', 'acao'];
  readonly dialog = inject(MatDialog);

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
    console.log(service.list());
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
      this.produtos$ = this.service.list();
    });
  }

  onEdit(id: number) {
    this.router.navigate([`${id}/edit`], { relativeTo: this.activatedRoute });
  }
}
