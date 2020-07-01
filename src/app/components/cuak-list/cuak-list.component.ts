import { Component, OnInit,Input } from '@angular/core';
import { Cuak,DeleteCuak, AllCuaks } from '../../services/cuak.service';
import { Apollo } from 'apollo-angular';

import swal from 'sweetalert';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'cuak-list',
  templateUrl: './cuak-list.component.html',
  styleUrls: ['./cuak-list.component.css']
})
export class CuakListComponent implements OnInit {

  @Input() Cuaks: Cuak[];
  @Input() identity;

  @Input() page;
  @Input() pagination;

  constructor(
    private apollo : Apollo
  ) { }

  ngOnInit(): void {
  }

   /* Amplia la imagen si haces un hover a la img o si sales vuelve a la normalidad */
   zoomImg(target,type) {

    let img = target as HTMLImageElement;
    let imgWrap = img.parentNode as HTMLDivElement;

    if (type == 'enter') {
      imgWrap.style.overflow = 'visible';

      img.style.transform = 'scale(1.75)';
      img.style.border = '1.7px lightgrey solid';
      img.style.position = 'relative';
      img.style.bottom = '0';
      img.style.zIndex = '1';

      if (window.screen.availWidth < 992) {
        img.style.width = '60vw';
        img.style.margin = '0 auto';
      }
    } else if (type == 'leave') {
      imgWrap.style.overflow = 'hidden';

      img.style.transform = 'scale(1)';
      img.style.border = 'none';
      img.style.position = 'inherit';
      img.style.bottom = 'inherit';
      img.style.zIndex = '0';

      if (window.screen.availWidth < 992) {
        img.style.width = '100%';
        img.style.margin = '0';
      }
      
    }
  }

  deleteCuak(cuak : Cuak){
    swal({
      title: "¿Está seguro?",
      text: "Una vez eliminado el cuak no habrá marcha atrás",
      icon: "warning",
      buttons: ['Cancelar','Eliminar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        
        //mutation - deleteCuak
        this.apollo
            .mutate({
              mutation : DeleteCuak,
              variables : { id : cuak._id},
              optimisticResponse : {
                  __typename : 'Mutation',
                  deleteCuak : {
                    __typename : 'Cuak',
                    _id : cuak._id,
                    title : cuak.title,
                    author : {
                      __typename : 'User',
                      _id : this.identity._id,
                      username : this.identity.username
                    }
                  }
              },
                // igual se puede hacer un refechtQueries pero puede aparecer algun cuak repetido 
                //si has cargado la pagina y eliminas uno de la anterior
               update : (proxy, { data : {deleteCuak}}) =>{
                  const data = proxy.readQuery({
                    query : AllCuaks,
                    variables : {
                      paginate : environment.lastPaginate
                    }
                  });
                  
                  var cuakArray = data['allCuaks']['results'].filter(c => c._id != cuak._id );
                  data['allCuaks']['results'] = cuakArray;

                  proxy.writeQuery({
                    query : AllCuaks, 
                    variables : {
                    paginate : environment.lastPaginate
                  },
                  data : data});
               }
              /*refetchQueries : [{
                query : AllCuaks,
                variables : {
                  paginate : environment.lastPaginate
                }
              }]*/
            }).subscribe(
              res =>{
                if (res.errors){
                  res.errors.map(e =>{
                    console.log(e);
                    swal("Error",e.message,"error");
                  });
                }
              });

        swal("El cuak con título '"+ cuak.title +"' se ha eliminado correctamente", {
          icon: "success",
        });
      } else {
        //nada
          //test de environment.ts
          console.log(environment.lastPaginate);
      }
    });
  }
}
