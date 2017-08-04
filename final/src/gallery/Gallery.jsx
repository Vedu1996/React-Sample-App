import React, { Component } from 'react';
import {observer} from 'mobx-react';

import galleryStore from '../store/GalleryStore';
import ImageList from './components/ImageList';
import App from '../imageUpload/App'
@observer
class Gallery extends Component {
    componentWillMount(){
        galleryStore.loadLatestPics();
    }
    render() {
        return (
            <div>
                <App />
                <ImageList images={galleryStore.getLatestPics} />
            </div>
        );
    }

}

export default Gallery;
