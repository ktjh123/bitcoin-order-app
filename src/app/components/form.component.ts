import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BitcoinService } from '../services/bitcoin.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit, AfterViewInit, OnChanges {
  orderTypeDefault = 'Buy';
  validAge = true;
  genderField: string;
  genderList: string[] = ['Male', 'Female'];
  tomorrow = new Date();
  myAmt = '0.00';
  buy = true;
  myPrice = 0;

  constructor(private bitcoinSvc: BitcoinService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngAfterViewInit() {

  }

  ngOnChanges() {

  }

  ngOnInit() {
    this.orderTypeDefault = this.activatedRoute.snapshot.params.orderType;
    this.bitcoinSvc.getPrice()
      .then(result => {
        this.myPrice = result.BTCSGD.ask;
      })
      .catch(error => {
        console.log(error);
      });
  }

  processForm(f: NgForm, myPrice, myAmt) {
    const x = this.bitcoinSvc.saveOrderDetails(f.value, myPrice, myAmt).then(result => {
      console.log(result);
      this.router.navigate(['/confirm', result.id]);
    });

  }

  checkAgeValid(dob) {
    const myDob = new Date(dob);
    const ageDifMs = Date.now() - myDob.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    const myAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (myAge < 21) {
      this.validAge = false;
    } else {
      this.validAge = true;
    }
  }

  checkBuyOrSell(f: string) {
    if (f === 'Buy') {
      this.buy = true;
    } else if (f === 'Sell') {
      this.buy = false;
    }
  }

  recalcMyAmt(buyOrSell, unit: number) {
    this.bitcoinSvc.getPrice()
      .then(result => {
        if (buyOrSell === 'Buy') {
          this.myPrice = result.BTCSGD.ask;
        } else if (buyOrSell === 'Sell') {
          this.myPrice = result.BTCSGD.bid;
        } else {
          this.myPrice = 0;
        }
      })
      .catch(error => {
        console.log(error);
      });

    if (isNaN(unit) || isNaN(this.myPrice)) {
      this.myAmt = '0.00';
    } else {
      const sum = unit * this.myPrice;
      this.myAmt = sum.toFixed(2);
    }
  }

}
