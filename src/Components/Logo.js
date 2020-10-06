import React from 'react';
import Tilt from 'react-tilt';
import face from './face_100.png'

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-2" options={{ max: 55 }} style={{ height: 120, width: 120 }} >
                <div className="Tilt-inner pa2"> <img src={face} alt="Logo" /> </div>
            </Tilt>
        </div>
    );
}
export default Logo