import { observable, action, computed } from 'mobx';
import getDB from '../config/constants';

class GalleryStore{
    @observable latestPics;
    @observable setDone;
    @action loadLatestPics(){
        console.log('Getting LATEST PICS');
        getDB()
        .ref('Images/')
        .on('child_added', (snapshot)=>{
            getDB()
            .ref('Images')
            .limitToFirst(10)
            .once('value', (snapshot)=>{
                let latest=[];
                snapshot.forEach(
                    (item)=>{
                        latest.push(item.val())
                        console.log(latest);
                    }
                );
                this.latestPics=latest;
            });
            // this.latestPics = getDB()
            //                     .ref('Images/')
            //                     .limitToFirst(10);
            // getDB()
            // .ref('Images')
            // .limitToFirst(10)
            // .once('value',
            //     (snapshot) => {
            //                 console.log('Got Snapshot');
            //                 (snapshot.forEach((child)=>{
                        //    if(this.latestPics===undefined)
                        //          this.latestPics = [];
                        //     this.latestPics.push(snapshot.val());
                        // })
                    // )
                // })
            });
    }
    @computed get getLatestPics(){
        if(this.latestPics!==undefined)
            return this.latestPics;
    }
}
const galleryStore = new GalleryStore();
export default galleryStore;
