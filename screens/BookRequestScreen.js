import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {BookSearch} from 'react-native-google-books';
import{Card,Header,Icon,FlatList} from 'react-native-elements';

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      requestedBookName:'',
      docId:'',
      bookStatus:'',
      requestId:'',
      dataSource:'',
      showFlatlist: false
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }
  async getBooksFromApi(bookName){
     this.setState({
       bookName: bookName
     })
     if(bookName.length>2){
       var books = await BookSearch.searchbook(bookName,'AIzaSyA4rQAGwzULQjiHdwZ7FFE23rjcAoTXK4s')
       this.setState({
         dataSource : books.data,
         showFlatlist: true
       })
     }

  }

  renderItem = ({item,i})=>{
    return(
      <TouchableHighlight style = {{
        alignItems:'center',
        backgroundColor:'#DDDDDD',
        padding: 10,
        width: '90%'
      }}
      activeOpacity = {0.6}
      underlayColor = '#DDDDDD'
      onPress = {()=>{
        this.setState({
          bookName: item.volumeInfo.title,
          showFlatlist: false
        })
      }}
      bottomDivider
      >
         <Text>
           {item.volumeInfo.title}
         </Text>
      </TouchableHighlight>
    )
  }

   getBookRequest=()=>{
     var bookRequest = db.collection('requested_books')
     .where('user_id','==',this.state.userId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
         if(doc.data().book_status === 'received'){
           this.setState({
             requestId: doc.data().request_id,
             requestedBookName: doc.data().book_name,
             bookStatus : doc.data().book_status,
             docId: doc.id,
             isRequestBookActive:''
           })
         }
       })
     })
   }
   getIsBookRequestActive(){
     db.collection('users')
     .where('email_id','==',this.state.userId)
     .onSnapshot(querySnapshot=>{
       querySnapshot.forEach(doc=>{
         this.setState({
           isRequestBookActive: doc.data().isRequestBookActive,
           userDocId: doc.id
         })
       })
     })
   }

  addRequest =async (bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    var books = await BookSearch.searchbook(bookName,'AIzaSyA4rQAGwzULQjiHdwZ7FFE23rjcAoTXK4s')
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        image_link : books.data[0].volumeInfo.ImageLinks.smallThumbnail
    })
    await this.getBookRequest()
    db.collection('users').where('email_id','==',userId).get()
    .then()
    .then(snapshot=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
          isRequestBookActive : true
        })
      })
    })

    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }


  render(){
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book"/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              {
                this.state.showFlatlist?
                (<FlatList
                  data = {this.state.dataSource}
                  renderItem = {this.renderItem}
                  enableEmptySections = {true}
                  style = {{marginTop : 10}}
                  keyExtractor= {(item,index)=>{
                    index.toString();
                  }}
                />)
                :(
              <View style ={{alignItems:'center'}}>
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
              </View>
                )}
            </KeyboardAvoidingView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
