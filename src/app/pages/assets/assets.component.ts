import { Component, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AssetService } from '../../services/asset.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Asset } from '../../models/Asset';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import { ToggleSwitchModule, ToggleSwitchStyle } from 'primeng/toggleswitch';

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
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  providers: [MessageService, ConfirmationService, AssetService],
  styleUrls: ['./assets.component.css'],
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
    ProgressSpinner,
    ToggleSwitchModule

  ]
})
export class AssetsComponent implements OnInit {

  assetDialog: boolean = false;

  assets = signal<Asset[]>([]);

  categories: Category[] = [];

  isLoading = signal<boolean>(false);

  asset!: Asset;

  selectedAssets!: Asset[] | null;

  submitted: boolean = false;

  statutes!: any[];

  @ViewChild('dt') dt!: Table;

  form!: FormGroup;

  action: string = '';

  cols: Column[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'brand', header: 'Brand' },
    { field: 'model', header: 'Model' },
    { field: 'category', header: 'Category' },
    { field: 'serialNumber', header: 'Serial Number' },
    { field: 'inventoryCode', header: 'Inventory Code' },
    { field: 'assignment', header: 'Assignment State' },
    { field: 'description', header: 'Description' }

  ];
  
  exportColumns: ExportColumn[] = [];
    
  constructor(
    private assetService: AssetService,
    private newMessageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService
  ) { 
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      serialNumber: new FormControl('', [Validators.required]),
      inventoryCode: new FormControl('', [Validators.required]),
      assignment: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.fAsset();
    this.fCategory();
  }

  exportCSV() {
    this.dt.exportCSV();
  }
  fAsset() {
    this.isLoading.set(true); // Set loading to true
    this.assetService.getAssets().subscribe({
        next: (data) => {
            this.assets.set(data); // Set all assets
            this.isLoading.set(false); // Set loading to false
            this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field}));
        },
        error: (error) => {
            console.error('Error loading assets:', error);
            this.isLoading.set(false); // Set loading to false in case of error
        },
    });
  }

  fCategory(){
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (data) => {
          this.categories = (data); // Set all categories
          this.isLoading.set(false); // Set loading to false
          this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field}));
      },
      error: (error) => {
          console.error('Error loading categories:', error);
          this.isLoading.set(false); // Set loading to false in case of error
      },
    });
  }

  openNew() {
    this.action = 'Add';
    this.asset = new Asset();
    this.submitted = false;
    this.assetDialog = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  updateAsset(asset: Asset) {
    this.action = 'Update';
    this.submitted = false;
    this.assetDialog = true;
    this.asset = asset;
    this.form.get('name')?.setValue(asset.name);
    this.form.get('brand')?.setValue(asset.brand);
    this.form.get('model')?.setValue(asset.model);
    this.form.get('serialNumber')?.setValue(asset.serialNumber);
    this.form.get('inventoryCode')?.setValue(asset.inventoryCode);
    this.form.get('assignment')?.setValue(asset.assignmentState);
    this.form.get('description')?.setValue(asset.description);
    this.form.get('category')?.setValue(asset.categoryId);
  }

  deleteAsset(asset: Asset) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + asset.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.assetService.deleteAsset(asset.id).subscribe({
                next: () => {
                    this.newMessageService.add({ severity: 'success', summary: 'Successful', detail: 'Asset Deleted', life: 3000 });
                    this.fAsset();
                },
                error: (error) => {
                    console.error('Error deleting asset:', error);
                    this.newMessageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting asset', life: 3000 });
                }
            });
        }
    });
  }

  deletedSelectedAssets() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected assets?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.assets.set(this.assets().filter((val) => !this.selectedAssets?.includes(val)));
            this.selectedAssets = null;
            this.newMessageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Assets Deleted',
                life: 3000
            });
        }
    });
  }

    saveAsset() {
        console.log(this.form.value);
        console.log(this.form.value.category.id);
        this.submitted = true;
        if (this.action == 'Update') {
            this.asset.name = this.form.value.name;
            this.asset.brand = this.form.value.brand;
            this.asset.model = this.form.value.model;
            this.asset.serialNumber = this.form.value.serialNumber;
            this.asset.inventoryCode = this.form.value.inventoryCode;
            this.asset.assignmentState = this.form.value.assignment;
            this.asset.description = this.form.value.description;
            this.asset.categoryId = this.form.value.category.id;
            this.assetService.updateAsset(this.asset).subscribe(data => {
                this.fAsset();
                })
        } else{
            this.asset = new Asset;
            this.asset.name = this.form.value.name;
            this.asset.brand = this.form.value.brand;
            this.asset.model = this.form.value.model;
            this.asset.serialNumber = this.form.value.serialNumber;
            this.asset.inventoryCode = this.form.value.inventoryCode;
            this.asset.assignmentState = this.form.value.assignment;
            this.asset.description = this.form.value.description;
            this.asset.categoryId = this.form.value.category.id;
            console.log(this.asset.description);
            this.assetService.saveAsset(this.asset).subscribe(data => {
                this.fAsset();
                })
        }
        this.assetDialog = false;
        this.form.reset();
        this.newMessageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Category saved successfully',
            life: 3000
            });
    }

    hideDialog() {
      this.assetDialog = false;
      this.submitted = false;
      this.form.reset();
  }

}
