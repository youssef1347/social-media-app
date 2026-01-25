import React from 'react'
import './Loading.css'

export const Loading = () => {
    return (
        <div className="loading-container">
            <div className='instagram-icon-loading-container'>
                <img
                    src="pngtree-instagram-logo-with-name-png-image_238618-removebg-preview.png"
                    alt="instagram logo" />
            </div>

            <div className="loading-meta-container">
                    <h6>from</h6>
                    <img src="images-removebg-preview.png" alt="meta logo" />
            </div>
        </div>
    )
}
