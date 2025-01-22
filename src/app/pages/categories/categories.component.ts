import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { Category } from '../../models/Category';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CategoryService } from '../../services/category.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  providers:[MessageService, ConfirmationService, CategoryService],
  imports: [
    CommonModule,
    FormsModule,
    RippleModule,
    ToastModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    RatingModule,
    TagModule,
    DialogModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
    categoryDialog: boolean = false;

    categories = signal<Category[]>([]);

    category!: Category;

    selectedCategories!: Category[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    form!: FormGroup;

    action: string = '';

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private categoryService: CategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.form = new FormGroup({
            description: new FormControl('', [Validators.required]),
        });
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.categoryService.getCategories().subscribe(data => {
            this.categories.set(data.content);
        });

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.action = 'Add';
        this.submitted = false;
        this.categoryDialog = true;
    }

    updateCategory(category: Category) {
        this.categoryDialog = true;
        this.action = 'Update';
        this.submitted = false;
        this.category = category;
        this.form.get('description')?.setValue(category.description);
    }

    deleteSelectedCategories() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categories.set(this.categories().filter((val) => !this.selectedCategories?.includes(val)));
                this.selectedCategories = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.categoryDialog = false;
        this.submitted = false;
        this.form.reset();
    }

    deleteCategory(category: Category) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this category:<br>' + category.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps:{
                label: 'Yes',
                severity: 'danger'
            },
            accept: () => {
                console.log(category.id);
                this.categoryService.deleteCategory(category.id).subscribe(data => {
                    this.loadData();
                });
                //this.category = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Category Deleted',
                    life: 3000
                });
            }
        });
    }

    // findIndexById(id: string): number {
    //     let index = -1;
    //     for (let i = 0; i < this.categories().length; i++) {
    //         if (this.categories()[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    // }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    saveCategory() {
        this.submitted = true;
        if (this.action == 'Update') {
            this.category.description = this.form.value.description;
            this.categoryService.updateCategory(this.category).subscribe(data => {
                this.loadData();
                })
        } else{
            this.category = new Category;
            this.category.description = this.form.value.description;
            console.log(this.category.description);
            this.categoryService.saveCategory(this.category).subscribe(data => {
                this.loadData();
                })
        }
        this.categoryDialog = false;
        this.form.reset();
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Category saved successfully',
            life: 3000
            });
    }
}
