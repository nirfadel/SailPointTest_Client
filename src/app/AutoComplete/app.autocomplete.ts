import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { AutoCompleteService } from "./service/app.autocomplete.service";
import { City } from "./autocomplete.model";
import { fromEvent, of } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-auto-complete',
    templateUrl: './app.autocomplete.html',
    styleUrls: ['./app.autocomplete.scss']
  })
  export class AutocompleteComponent implements OnInit,AfterViewInit {

    @ViewChild('citySearch') cityInput: ElementRef;
    @Output()
    cityEvent = new EventEmitter<{city: City}>();
    cities: City[] = [];
    showDivResult: boolean = false;
    isLoading:boolean = false;
    @ViewChildren("menuItems") 
    private menuItemsRef: QueryList<ElementRef>;
    index: number = 0;

    constructor(private service: AutoCompleteService){}
    
    ngOnInit(): void {
        
       }
    ngAfterViewInit() {
        this.searchInit();
    }
    searchInit()
    {
        const _searchResult = fromEvent(this.cityInput.nativeElement, 'keyup').pipe(
            map((event: any) => event.target.value),
            debounceTime(400),  
            distinctUntilChanged(),
            tap(()=> this.isLoading = true),
            switchMap((term) => term ? this.service.getCities(term) : of<City[]>(this.cities)),
            tap(() => {
              this.isLoading = false,
              this.showDivResult = true;
            }));

            _searchResult.subscribe(res=>{
                this.isLoading = false;
                this.cities = res;
            });
            var keydown = fromEvent(this.cityInput.nativeElement, 'keydown');
            keydown.subscribe((x: KeyboardEvent) =>{
           
              if(this.cities.length > 0)
              {
                this.onKeyDown(x);
              }
           });
            
    }

    setCity(city:City){
      this.cityEvent.emit({city});
      this.cityInput.nativeElement.value = city.name;
      this.showDivResult = false;
    }

    clearItemsClass()
    {
      this.menuItemsRef.forEach(x=>{
        x.nativeElement.className = "search-result";
      }); 
    }

    onKeyDown(event: KeyboardEvent) {
      let elem :any = null;
      switch (event.key) {
        case "ArrowUp":
          event.stopPropagation();
          this.clearItemsClass();
          elem = (this.index === 0
             ? this.menuItemsRef.last 
             : this.menuItemsRef.get(this.index - 1)
          ).nativeElement;
          elem.focus();
          elem.className = "search-result-selected";
          if(this.index != 0)
          {
            this.index--;
          }
          break;
      
        case "ArrowDown":
          event.stopPropagation();
          this.clearItemsClass();
          elem = (this.index === this.menuItemsRef.length - 1
            ? this.menuItemsRef.first 
            : this.menuItemsRef.get(this.index + 1)
          ).nativeElement;
          elem.focus();
          elem.className = "search-result-selected";
          if(this.index != this.menuItemsRef.length - 1)
          {
            this.index++;
          }
          break;
          case "Enter":
            this.setCity(this.cities[this.index]);
            this.index = 0;
            break;
          case "Backspace":
            this.index = 0;
            break;
          case "Delete":
            this.index = 0;
            break;
      }
    }

  }