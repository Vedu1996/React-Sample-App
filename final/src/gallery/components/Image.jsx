import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import ReactSpinner from 'react-spinjs';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import getDB, { getStorageRef } from '../../config/constants';

import '../../bootstrap/css/bootstrap.min.css';



const ActualImage = observer((props)=>
  <div>
    <div className = 'col-xs-12 col-sm-6 col-md-4 col-lg-3' style={{marginTop: '3em'}}>
            <div>
                <img
                style={{height:'20em', width:'20em'}}
                className = 'img-circle img-thumbnail img-responsive'
                onClick = { props.clickAction }
                src = { props.source.imageURL } />
                <button onClick = { props.deleteFile.bind(null, props.source.imageURL, props.source.id) } />
            </div>
    </div>
    {
        props.showModal &&
        <ModalContainer onClose={props.closeAction}>
            <ModalDialog onClose={props.closeAction}>

                <div>
                  <center>
                    <img
                    style={{height:'60vh', width:'60vw'}}
                    className = 'img-responsive'
                    onClick = { props.clickAction }
                    src = { props.source.imageURL }/>
                    <a  target="_blank"  href={ props.source.imageURL }>{props.source.fileName}</a>
                  </center>
                </div>
              </ModalDialog>
        </ModalContainer>

    }
  </div>)


@observer
class Image extends Component {
    @observable isShowingModal = false;
    @observable hasLoaded = false;
    @action handleClick = () => this.isShowingModal = true;
    @action handleClose = () => this.isShowingModal = false;
    @action handleLoaded = () => this.hasLoaded = true;
    comonentWillMount(){
      this.isShowingModal = false;
      this.hasLoaded = false;
    }
    @action deleteFile = (url, id)=>{
      console.log(id);
      getStorageRef()
        .refFromURL(url)
        .delete()
        .then(
          ()=>{
            getDB()
              .ref('Images/'+id)
              .remove();
          }
        )
        .catch(
          ()=>console.log('Unable to delete!')
        );
    }
    render() {
        console.log('renderImg');
        this.isLoading = this;
        return (
          <ActualImage
            source = { this.props.image }
            clickAction = { this.handleClick }
            closeAction = { this.handleClose }
            showModal = { this.isShowingModal }
            deleteFile = { this.deleteFile }/>
        );
    }

}

export default Image;
