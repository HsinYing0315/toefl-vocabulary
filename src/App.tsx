/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { useEffect, useReducer } from 'react';

interface State {
  words: {[key: string]: string} | null;
  currentWord: string;
  currentChoices: string[];
  correct: boolean | null;
}

const shuffle = (array: string[]): string[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

const reducer = (state: any, action: any) => {
  const random = Math.random();
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        words: action.payload,
        currentWord: Object.keys(action.payload)[Math.floor(random * Object.keys(action.payload).length)],
        currentChoices: shuffle([
          ...Object.values(action.payload).sort(() => .5 - Math.random()).slice(0,3),
          action.payload[Object.keys(action.payload)[Math.floor(random * Object.keys(action.payload).length)]]
        ]),
      }
    case 'IS_CORRECT':
      return { 
        ...state,
        correct: action.payload
      };
    default:
      return state;
  }
}
function App() {
  const initialState: State = {
    words: null,
    currentWord: '',
    currentChoices: [],
    correct: null
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const fetchData = async () => {
      const response: {[key: string]: string} = await fetchWords();
      dispatch({
        type: 'INITIALIZE',
        payload: response
      })
    }
    fetchData();
  }, []);
  const fetchWords = async () => {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyZW9ei83mBP0HHau4b2t_UPa7STb_N8dIYOgBAQX-o_486fPbVSp3_UxU6veBDHqqz/exec');
    const data = await response.json();
    return data
  }
  
  const handleIsCorrect = (choice: string) => {
    dispatch({
      type: 'IS_CORRECT',
      payload: choice === state.words[state.currentWord]
    })
  }
  const nextOne = (choice: string) => {
    handleIsCorrect(choice);
    dispatch({
      type: 'INITIALIZE',
      payload: {
        ...state.words
      }
    })
  }
  
  return (
    <div className='h-full w-full flex flex-col gap-20 items-center justify-center'>
      <h1 className='text-8xl font-bold'>{state.currentWord}</h1>
      <div className='flex flex-col gap-3 text-2xl'>
        {state.currentChoices.map((choice: string, index: number) => (
          <button key={index} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => nextOne(choice)}>{choice}</button>
        ))} 
      </div>
    </div>
  )
}

export default App
