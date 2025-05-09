/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
<<<<<<< HEAD
import App from '../src/App';
=======
import App from '../App';
>>>>>>> b62126718e3a003c20afaaefd21bf8d164ab0c20

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
