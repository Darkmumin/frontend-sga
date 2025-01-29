export class Asset {
    id: number;
    assignmentState: boolean;
    brand: string;
    categoryId: number;
    description: string;
    inventoryCode: string;
    model: string;
    name: string;
    serialNumber: string;

    constructor(id: number = 0, assignmentState = false, description: string = '', brand: string = '', categoryId: number = 0, inventoryCode: string = '', model: string = '', name: string = '', serialNumber: string = '') {
        this.id = id,
        this.assignmentState = assignmentState,
        this.description = description,
        this.brand = brand,
        this.categoryId = categoryId,
        this.inventoryCode = inventoryCode,
        this.model = model,
        this.name = name,
        this.serialNumber = serialNumber
    }
}