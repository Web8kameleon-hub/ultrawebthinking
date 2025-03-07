import React from 'react';
import useStore from '../store/useStore';

const Counter = () => {
  const { count, increase, decrease } = useStore();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </div>
  );
};

export default Counter;


