import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getDB, { getStorageRef } from '../config/constants';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';

@observer
class App extends Component {
  @observable progress = 0;
  @observable doneMessage;
  @observable file;
  @action handleUpload(event){
      this.doneMessage = undefined;
      this.progress = 0;
      let file = event.target.files[0];
      this.file=file;
      console.log(this.getFile);
  }
  @action clickHandle(){
      console.log('Putting Into STORAGE');
      getStorageRef()
      .ref('Images/'+this.getFile.name)
      .put(this.getFile)
      .on('state_changed',
        (snapshot)=>{
            let progress = snapshot.bytesTransferred*100/snapshot.totalBytes;
            this.progress = progress;
        },
        (err)=>{
            console.log('ERROR OCCURED: ' + err);
        },
        ()=>{
            let doneMessage = 'UPLOAD COMPLETE!';
            this.doneMessage=doneMessage;
            getStorageRef()
                .ref('Images/' + this.getFile.name)
                .getDownloadURL().then(
                    (URL)=>{
                        console.log('Putting URL INTO DB');
                        let ref = getDB()
                        .ref('Images/')
                        .push();
                        console.log(ref);
                        ref.set({
                            fileName: this.getFile.name,
                            imageURL: URL,
                            id: ref.key
                        });
                    }
                );
        });
  }
  @computed get getFile(){
      return this.file;
  }
  @computed get getProgress(){
      return this.progress;
  }
  @computed get getDoneMessage(){
      return this.doneMessage;
  }
  render() {
    return (
      <div>
          <div>
              <Progress progress = { this.getProgress }></Progress>
              <FileInput handler = {this.handleUpload.bind(this)}/>
              <SubmitButton handler = { this.clickHandle.bind(this) } />
              { this.getDoneMessage?this.getDoneMessage:'' }
          </div>
      </div>
    );
  }
}


const Progress = ({progress}) => (
    <progress value={progress} id='progBar'></progress>
);

Progress.propTypes = {
    progress : PropTypes.number
};

const FileInput = ({handler}) => (
    <div>
        <input
            type='file'
            id='uploadButton'
            onChange={handler}/>
    </div>
);

const SubmitButton = ({handler}) => (
    <div>
        <input
            type='submit'
            value='Upload'
            id='submit'
            onClick={handler}/>
    </div>
);




export default App;
