import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProdutosService } from '../service/produtos.service';
import { Produto } from '../model/produto';

@Component({
  selector: 'app-form-produtos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './form-produtos.component.html',
  styleUrl: './form-produtos.component.scss',
})
export class FormProdutosComponent {
  produtoForm: FormGroup;
  title = 'Cadastrar';
  currentAction = 'new';
  @Input({required: true}) produto: Produto | undefined;

  constructor(
    private builder: FormBuilder,
    private service: ProdutosService,
    private snackBar: MatSnackBar,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.produtoForm = this.builder.group({
      nome: [null],
      descricao: [null],
    });

    if (this.router.url.includes('edit')) {
      this.currentAction = 'edit';
      this.title = 'Alterar';
      this.updateForm();
    }
  }

  updateForm() {
    // this.route.paramMap
    //   .pipe(switchMap((params) => this.service.getOne(this.getRouteId())))
    //   .subscribe((res) => {
    //     this.produtoForm.patchValue(res);
    //   });
    this.route.queryParams.subscribe(p => {
      this.produtoForm.patchValue(p);
    });
  }

  onCancel() {
    this.location.back();
  }

  onSubmit() {
    const produto = this.produtoForm.value;
    const request$ =
      this.currentAction === 'new'
        ? this.service.create(produto)
        : this.service.update(this.getRouteId(), produto);

    request$.subscribe({
      next: (v) => this.onSucess(),
      error: (e) => this.snackBar.open(e, '', { duration: 1000 }),
      complete: () => console.info('complete'),
    });
  }

  onSucess() {
    const message = this.currentAction === 'new' ? 'Cadastrado' : 'Alterado';
    this.snackBar.open(message, '', { duration: 1000 });
    this.location.back();
  }

  private getRouteId(): number {
    return +this.route.snapshot.paramMap.get('id')!;
  }
}
