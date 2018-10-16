import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable()
export class SalesService {

    constructor(private http: HttpClient) {}

    findUserSales(id: number, page: number, size: number, success: (res) => void, error: (error1) => void) {
        this.http.get("/sales/findUserSales?id="+id+"&page="+page+"&size="+size+"&sort=createdAt,desc")
            .subscribe(success, error)
    }

    get(page: number, size: number, success: (res) => void, error1: (err) => void) {
        this.http.get("/sales?page="+page+"&size="+size+"&sort=createdAt,desc").subscribe(success, error1)
    }

    createNewSale(email: string, id: number, success: (res) => void, error: (err) => void) {
        this.http.get("/sales/createNewSale/"+email+"/"+id).subscribe(success, error)
    }

    delete(id: any, success: (res) => void, error: (err) => void) {
        this.http.delete("/sales/"+id).subscribe(success, error)
    }

    addSalesLineItem(saleId: any, bundleId: any, success: (res) => void, error: (err) => void) {
        this.http.get("/sales/addSalesLineItem/" + saleId + "/" + bundleId).subscribe(success, error)
    }

    deleteSalesLineItem(saleId: any, salesLineItemId: any, success: (res) => void, error: (err) => void) {
        this.http.delete("/sales/deleteSalesLineItem/" + saleId + "/" + salesLineItemId).subscribe(success, error)
    }

    confirmSale(id: number, success: (res) => any, error: (error) => any) {
        this.http.get("/sales/confirmSale/"+id).subscribe(success, error)
    }

    findById(saleId: number, param2: (success) => any, param3: (error) => any) {
        this.http.get("/sales/"+saleId).subscribe(param2, param3)
    }

    getEndpoint(endpoint: any, param2: (res) => void, param3: (res) => void) {
        this.http.get(endpoint).subscribe(param2, param3)
    }

    pay(id: any, amount: number , param2: (res) => void, param3: (res) => void) {
        this.http.post("/sales/pay/"+id, amount).subscribe(param2, param3)
    }

    searchByLastName(query: string, page: number, size: number, success: (res) => void, error1: (err) => void) {
        this.http.get("/sales/searchByLastName?lastName="+query+
            "&page="+page+"&size="+size+"&sort=createdAt,desc").subscribe(success, error1)
    }

    searchByDate(query: string, id: number, page: number, size: number, success: (res) => void, error1: (err) => void) {
        this.http.get("/sales/searchByDate?id="+id+"&date="+query+
            "&page="+page+"&size="+size+"&sort=createdAt,asc").subscribe(success, error1)
    }
}