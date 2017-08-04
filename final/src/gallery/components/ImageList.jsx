import React, { Component } from 'react';
import {observer} from 'mobx-react';
import Image from './Image';

import '../../bootstrap/css/bootstrap.min.css';

@observer
class ImageList extends Component {
    constructor(){
        super();
    }
    render() {
        return (
            <div className = 'row'>
                <hr />
                {
                    (this.props.images)?
                        this.props.images.slice().map(
                        (img)=>
                            <Image key = { img.id } image = {img}></Image>                        )

                        :''
                }
                <hr />
            </div>
        );
    }

}

export default ImageList;
