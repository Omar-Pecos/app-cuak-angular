import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { Query, Mutation ,Subscription } from 'apollo-angular';
import gql from 'graphql-tag';


/* Interfaces (o modelos) */
export interface Cuak {
  _id : string,
  title : string,
  text : string,
  date : string,
  lastRepliedAt : string,
  image : string,

  author : any,
  favorites : any,
  replies : any,
  isFavorited : boolean,
  likesText : string,
  newReplies : any
}

export interface Conversation {
  _id : string,
  title : string,
  type : string,
  participants : any,
  messages : any,
  
  notifications : any
}

/*export interface Response {
  allCuaks : Cuak[];
}*/

@Injectable({
  providedIn: 'root'
})
export class CuakService {
  //para otros servicios o nose
  constructor(
    private http : HttpClient
  ) { }

  getNewUrlImg() : Observable<any>{
      return this.http.get('https://source.unsplash.com/random');
  }
}

/* Queries de CUAK */

  //AllCuaks era una class extendia de Query<Response> pero ahora solo utilizo el gql con 
  //y de ultimas lo he tenido como clase y en document = gql``

export const AllCuaks  = gql`
    query allCuaks ($paginate : PagInput) {
        allCuaks (paginate : $paginate) {
            hasNext
            next
            hasPrevious
            previous
            
            results{
              _id
              title
              text
              image
              date

              author{
                _id
                username
              }
              favorites{
                userId
                user{
                  username
                }
              }
              replies{
                _id
                text
                date
                user{
                  _id
                  username
                }
              }
            }
        }
  }
`

export const OneCuak = gql`
    query oneCuak ($id : ID!){
        oneCuak (id : $id){
            _id
            title
            text
            image
            date

            author{
              _id
              username
            }
            favorites{
              userId
              user{
                username
              }
            }
            replies{
              _id
              text
              date
              user{
                _id
                username
              }
            }
        }
    }
  `

export const SearchCuaks =  gql`
    query searchCuaks ($search : String!){
        searchCuaks (search : $search){
              _id
              title
              text
              image
              date

              author{
                _id
                username
              }
              favorites{
                userId
                user{
                  username
                }
              }
        }
    }
  `

/* MUTATIONS FOR CUAKS */

export const AddCuak = gql`
      mutation addCuak (
          $input : newCuakInput!,
          $imageFile : Upload
      ){
          addCuak(
            input : $input,
            imageFile : $imageFile
          ){
              _id
              title
              text
              date
              image
              author{
                _id
                username
              }
          }
      }
  `

export const EditCuak = gql`

  mutation editCuak(
      $id : ID!,
      $input : newCuakInput!,
      $imageFile : Upload
  ){
      editCuak(
          id : $id,
          input : $input,
          imageFile : $imageFile
      ){
            _id
            title
            text
            date
            image
            author{
              _id
              username
            }
      }
  }
`

export const DeleteCuak = gql`
  mutation deleteCuak($id : ID!){
      deleteCuak(id : $id){
        _id
        title
        author{
          _id
          username
        }
      }
  }
`

/* FAVORITE */

  /* Mutations */
  export const MarkAsFavorite = gql`
    mutation markAsFavorite(
      $cuakId : ID!
    ){
        markAsFavorite(
            cuakId : $cuakId
        ){
            userId,
            user{
              username
            }
        }
    }
  `

  export const UnmarkAsFavorite = gql`
  mutation unmarkAsFavorite(
    $cuakId : ID!
  ){
      unmarkAsFavorite(
          cuakId : $cuakId
      ){
          userId,
          user{
            username
          }
      }
  }
`

/* Replies */
export const AddReply = gql`
  mutation addReply(
      $cuakId : ID!,
      $text : String!
  ){
      addReply(
          cuakId : $cuakId,
          text : $text
      ){
            _id
            text
            date
            user{
              _id
              username
            }
      }
  }
`

export const EditReply = gql`
  mutation editReply (
      $replyId : ID!,
      $text : String!
  ){
      editReply(
          replyId : $replyId,
          text : $text
      ){
            _id
            text
            date
            user{
              _id
              username
            }
      }
  }
`

export const DeleteReply = gql`
  mutation deleteReply (
      $replyId : ID!
  ){
      deleteReply(
          replyId : $replyId
      ){
            _id
            text
            date
            user{
              _id
              username
            }
      }
  }
`

/* Conversations */
export const AllConversations = gql`
  query allConversations{
      allConversations{
          _id
          title
          type
          notifications
          
          participants{
            _id
            username
          }
          messages{
            _id
            text
            date 
            converId

            sender{
              _id
              username
            }
          }
    }
  }
`

export const MyConversations = gql`
    query myConversations{
        myConversations{
            _id
            title
            type

            participants{
              _id
              username
            }
        }
    }
`

export const AddPrivateConversation = gql`
    mutation addPrivateConversation(
        $userIds : [String]! 
    ){
        addPrivateConversation(
            userIds : $userIds
        ){
              _id
              title
              type

              participants{
                _id
                username
              }
        }
    }
`

export const JoinConversation = gql`
    mutation joinConversation(
      $id : ID!
    ){
        joinConversation(
           id : $id
        ){
              _id
              title
              type
              notifications
              
              participants{
                _id
                username
              }
              messages{
                _id
                text
                date 
                converId

                sender{
                  _id
                  username
                }
              }
        }
    }
`

/* Messages */
export const NewMsg = gql`
    mutation newMsg(
      $text : String!
      $converId : ID!
    ){
       newMsg(
          text : $text
          converId : $converId
       ){
              _id
              text
              date 

              sender{
                _id
                username
              }
       }
    }
`

/* Subscriptions */

export const NewReplySub = gql`
    subscription newReplySub {
      newReplySub {
        _id
        text
        cuakId

        user{
          _id
          username
        }
      }
    }
  `

export const NewMsgSub = gql`
    subscription newMsgSub{
        newMsgSub{
            _id
            text
            date
            converId

            sender{
              _id
              username
            }
        }
    }
`

export const NewPrivateConverSub = gql`
    subscription newPrivateConver{
        newPrivateConver{
              _id
              title
              type
              notifications
              
              participants{
                _id
                username
              }
              messages{
                text
                date 
                converId

                sender{
                  _id
                  username
                }
              }
        }
    }
`