// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'

/*test('sanity', () => {
  expect(true).toBe(false)
})*/

describe('Spinner Component tests', () => {
  
  test('Spinner does not render when prop on is false', () => {
    render(<Spinner on={false} />);
    const spinner = screen.queryByTestId('spinner');
    expect(spinner).not.toBeInTheDocument();
  })

  test('Spinner does render when prop on is true', () => {
    render(<Spinner on={true} />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  })

  test('If on = true display "Please wait..." text', () => {
    render(<Spinner on={true} />);
    const text = screen.getByText('Please wait...');
    expect(text).toBeInTheDocument();
  })

})
