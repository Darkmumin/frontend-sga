export class Staff {
    id: number;
    address: string;
    city: string;
    dni: number;
    email: string;
    lastName: string;
    name: string;
    phone: string;

    constructor(data?: Partial<Staff>) {
        this.id = data?.id ?? 0;
        this.address = data?.address ?? '';
        this.city = data?.city ?? '';
        this.dni = data?.dni ?? 0;
        this.email = data?.email ?? '';
        this.lastName = data?.lastName ?? '';
        this.name = data?.name ?? '';
        this.phone = data?.phone ?? '';
    }
}