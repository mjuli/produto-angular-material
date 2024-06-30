import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ProdutosService } from '../../service/produtos.service';

@Component({
  selector: 'on-delete-dialog',
  templateUrl: 'on-delete-dialog.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class OnDeleteDialog {
  readonly dialogRef = inject(MatDialogRef<OnDeleteDialog>);
  readonly data = inject<{ id: number }>(MAT_DIALOG_DATA);

  constructor(private service: ProdutosService) {}

  onDelete(id: number) {
    console.log('id recebido: ' + id);
    this.service.delete(id).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.log(e),
    });
    this.dialogRef.close();
  }
}
