import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { ContactForm } from './contactform';



export const Home = () => {

  const { store, actions } = useContext(Context);


  return (
    <div className="Container">
      <div className='row'>
      <div className='col content-home'>
        <p>
          Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,Content,
        </p>
      </div>
      </div>
    </div>
  );
};