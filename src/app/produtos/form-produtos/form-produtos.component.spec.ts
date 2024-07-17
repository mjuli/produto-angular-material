import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutosService } from '../service/produtos.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormProdutosComponent } from './form-produtos.component';
import { RouterModule } from '@angular/router';

describe('FormProdutosComponent', () => {
  let component: FormProdutosComponent;
  let fixture: ComponentFixture<FormProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormProdutosComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
      ],
      providers: [ProdutosService],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
