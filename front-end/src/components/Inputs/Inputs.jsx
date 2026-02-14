import './Inputs.css'
import React, { useState } from 'react'
import { MdErrorOutline } from "react-icons/md";

export const Inputs = ({ type, inputRef, id, name, labelValue, errorMessage }) => {
    const [labelClassName, setLabelClassName] = useState('');


    function handleChangeClassName(ev) {
        const value = ev.target.value;

        setLabelClassName(value ? 'input-has-value' : '');
    }


    return (
        <>
            <input
                className={errorMessage ? 'error-input' : 'input'}
                onChange={handleChangeClassName}
                ref={inputRef}
                id={id}
                name={name}
                type={type} />
            <label
                style={errorMessage ? {color: 'rgb(248, 76, 70)'} : {color: 'rgba(255, 255, 255, 0.226)'}}
                className={labelClassName}
                htmlFor={id}>
                    {labelValue}
            </label>


            {errorMessage && <p className='error-message'>
                <MdErrorOutline className='error-icon'/>
                {errorMessage}</p>}
        </>
    )
}

