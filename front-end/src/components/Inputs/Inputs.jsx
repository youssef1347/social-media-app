import './Inputs.css'
import React, { useState } from 'react'

export const Inputs = ({ type, inputRef, id, name, labelValue }) => {
    const [className, setClassName] = useState('');


    function handleChangeClassName(ev) {
        const value = ev.target.value;

        setClassName(value ? 'input-has-value' : '');
    }


    return (
        <>
            <input
                className='input'
                onChange={handleChangeClassName}
                ref={inputRef}
                id={id}
                name={name}
                type={type} />
            <label
                className={className}
                htmlFor={id}>
                    {labelValue}
            </label>
        </>
    )
}

