import { useState } from 'react'
import './App.css'
import { Select } from './Select';
import { SelectOption } from './Select';

function App() {

  const options = [
    { label: "apple", value: "apple" },
    { label: "banana", value: "banana" },
    { label: "mango", value: "mango" },
    { label: "pineapple", value: "pineapple" },
    { label: "guava", value: "guava" },
    { label: "grapes", value: "grapes" },
  ]

  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(options[0]);
  const [multiVal, setMultiVal] = useState<SelectOption[]>([options[0]]);

  return (
    <>

    {/* Single select */}
      <Select
        options={options}
        value={selectedOption}
        onChange={(option => setSelectedOption(option))}
      />

    {/* Mutliple select */}
      <Select
        multiple
        options={options}
        value={multiVal}
        onChange={(options => setMultiVal(options))}
      />
    </>
  )
}

export default App
