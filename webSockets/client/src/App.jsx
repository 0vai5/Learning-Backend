import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


const App = () => {
  const [username, setUsername] = useState('');
  return (
    <>
    <TextField id="filled-basic" value={username} onChange={e => setUsername(e.target.value)} label="Filled" variant="filled" />
    <Button variant="contained" onClick={() => console.log(username)}>Hello world</Button>
    </>
  )
}

export default App