import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "todos.json");

// const DATA_FILE = path.join(__dirname, "todos.json");

// =====================================
// Express App
// =====================================

const app = express();


app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());



// =====================================
// Local JSON Database
// =====================================




if (!fs.existsSync(DATA_FILE)) {
  if (!process.env.VERCEL) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify([], null, 2)
    );
  }
}

let todos = [];

try {

  todos = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );

} catch(error){

  todos = [];

}

// =====================================
// JSON Helper Functions
// =====================================

function loadTodos(){

  try {

    todos = JSON.parse(
      fs.readFileSync(DATA_FILE,"utf8")
    );


  }catch(error){

    todos=[];

  }

}


function saveTodos() {
  // Local only
  if (!process.env.VERCEL) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(todos, null, 2)
    );
  }
}


// =====================================
// Firestore Helpers
// =====================================


const todosRef = collection(
  db,
  "todos"
);


// GET USER TODOS

async function getUserTodos(uid){


  const q = query(

    todosRef,

    where(
      "uid",
      "==",
      uid
    ),

    orderBy(
      "createdAt",
      "desc"
    )

  );


  const snapshot = await getDocs(q);



  return snapshot.docs.map(doc=>({

    id:doc.id,

    ...doc.data()

  }));

}


// CREATE TODO


async function addFirestoreTodo(todo){


  const docRef = await addDoc(

    todosRef,

    todo

  );


  return {

    id:docRef.id,

    ...todo

  };


}

// UPDATE TODO

async function updateFirestoreTodo(
  id,
  data
){


  const todoRef = doc(

    db,

    "todos",

    id

  );


  await updateDoc(

    todoRef,

    data

  );


}


// DELETE TODO


async function deleteFirestoreTodo(id){


  const todoRef = doc(

    db,

    "todos",

    id

  );


  await deleteDoc(todoRef);


}


// =====================================
// HOME ROUTE
// =====================================


app.get("/",(req,res)=>{


  res.json({

    success:true,

    message:
    "Todo Backend Running 🚀",

    storage:
    "Firestore + todos.json"

  });


});


// =====================================
// GET TODOS BY UID
// =====================================


app.get(
"/todos/:uid",
async(req,res)=>{


const {uid}=req.params;


try{


const firestoreTodos =
await getUserTodos(uid);

// Sync JSON

loadTodos();


todos =
todos.filter(
(todo)=>todo.uid!==uid
);


todos.push(
...firestoreTodos
);


saveTodos();


res.json({

success:true,

todos:firestoreTodos

});


}catch(error){


console.error(
"GET ERROR:",
error
);


res.status(500).json({

success:false,

message:
"Failed to get todos"

});


}


});


// =====================================
// CREATE TODO
// =====================================


app.post(
"/todos",
async(req,res)=>{


try{


const {

uid,

text,

title,

description

}=req.body;


if(!uid || (!text && !title)){


return res.status(400).json({

success:false,

message:
"uid and text required"

});


}


const newTodo = {


uid,


text:
text || title,


title:
title || text,


description:
description || "",


completed:false,


createdAt:
serverTimestamp()


};


const savedTodo = await addFirestoreTodo(newTodo);


// JSON backup


loadTodos();


todos.push({

...savedTodo,

createdAt:
new Date().toISOString()

});


saveTodos();


res.status(201).json({

success:true,

todo:savedTodo

});




}catch(error){


console.error(
"POST ERROR:",
error
);



res.status(500).json({

success:false,

message:
"Failed to create todo"

});


}


});


// =====================================
// UPDATE TODO
// =====================================


app.put(
"/todos/:id",
async(req,res)=>{


const {id}=req.params;


try{


const {

text,

title,

description,

completed

}=req.body;


const updateData={};


if(text!==undefined)
updateData.text=text;


if(title!==undefined)
updateData.title=title;


if(description!==undefined)
updateData.description=description;


if(completed!==undefined)
updateData.completed=completed;



updateData.updatedAt =
serverTimestamp();





await updateFirestoreTodo(
id,
updateData
);






// Update JSON


loadTodos();


const index =
todos.findIndex(
(todo)=>todo.id===id
);


if(index!==-1){


todos[index]={

...todos[index],

...updateData,

updatedAt:
new Date().toISOString()

};


saveTodos();


}





res.json({

success:true,

message:
"Todo updated"

});


}catch(error){

console.error(
"UPDATE ERROR:",
error
);

res.status(500).json({

success:false,

message:
"Failed to update"

});

}

});

// =====================================
// DELETE TODO
// =====================================

app.delete(
"/todos/:id",

async(req,res)=>{

const {id}=req.params;

try{

// Firestore delete

await deleteFirestoreTodo(id);

// JSON delete
loadTodos();

todos =
todos.filter(
(todo)=>todo.id!==id
);

saveTodos();

res.json({

success:true,

message:
"Todo deleted"

});

}catch(error){

console.error(
"DELETE ERROR:",
error
);

res.status(500).json({

success:false,

message:
"Failed to delete"

});

}

});

// });


const PORT = process.env.PORT || 3000;


if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;