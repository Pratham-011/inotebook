import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=>{
  const host = "http://localhost:5000"
    // const s1 = {
    //     "name": "Pratham",
    //     "class": "5b"
    // }
    // const [state,setState] = useState(s1);
    // const update = ()=>{
    //     setTimeout(()=>{
    //         setState({
    //             "name": "la",
    //             "class": "51b"
    //         })
    //     },1000);
    // }

    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial)

    const getNotes = async ()=>{

      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token')      
          } 
           });
      // const json = response.json();
           const json = await response.json()
          //  console.log(json)
           setNotes(json)
        
    }

    // add note
    const addNote = async (title,description,tag)=>{

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token')      
          },
        body: JSON.stringify({title,description,tag})
      });
      const note = await response.json();
      setNotes(notes.concat(note))

    //   console.log(json)

    //     console.log("Adding")
    //  const   note = json;
    }
    // delete note
    const deleteNote = async (id)=>{
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token')       
         }
      });
      const json = response.json();
      // console.log(json)
        const newNotes = notes.filter((note)=>{return note._id !==id})
        setNotes(newNotes)
    }

    // edit note
    const editNote = async (id, title, description, tag) => {
      try {
        console.log("Editing Note:", id);
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          },
          body: JSON.stringify({ title, description, tag }),
        });
        const json = await response.json();
        // console.log("Edited Note:", json);
        
        // Update notes in state after successful response
        const updatedNotes = notes.map((note) =>
          note._id === id ? { ...note, title, description, tag } : note
        );
        setNotes(updatedNotes);
      } catch (error) {
        console.error("Error editing note:", error);
        // Optionally, log more detailed error information
        console.error("Error details:", error.message);
        // Add additional error handling logic as needed
      }
    };
    
    
    return(
        
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>

    )
}
export default NoteState