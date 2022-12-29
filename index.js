const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT | 5000;
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mttjtbw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run()
{
    try{
         const taskCollections = client.db('todo-app').collection('taskCollection');

         //store to-do task

         app.post('/tasks',async(req,res)=>{
             const taskInfo = req.body;
             const result = await taskCollections.insertOne(taskInfo);
             res.send(result)
         });

         //get all todo-task

         app.get('/tasks',async(req,res)=>{

            const query = {
                isComplete : false
            }

            const allTasks = await taskCollections.find(query).toArray();
            return res.send(allTasks)
         });

         //get all complete task 
         app.get('/complete-tasks',async(req,res)=>{

            const query = {
                isComplete : true
            }

            const allTasks = await taskCollections.find(query).toArray();
            return res.send(allTasks)
         });

         // update complete status 

         app.put('/update-complete-status/:id',async(req,res)=>{
                const taskCompleteId = req.params.id;
                
                const filter = { _id: ObjectId(taskCompleteId) };
                const options = { upsert: true };

                const updateDoc = {
                    $set: {
                        isComplete: true
                    },
                  };

                const result = await taskCollections.updateOne(filter,updateDoc,options);
                return res.send(result)
         });


         app.put('/update-not-complete-status/:id',async(req,res)=>{
            const taskCompleteId = req.params.id;
            
            const filter = { _id: ObjectId(taskCompleteId) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    isComplete: false
                },
              };

            const result = await taskCollections.updateOne(filter,updateDoc,options);
            return res.send(result)
     });


         //task delete 

         app.delete('/delete-task/:id',async(req,res)=>{
            const deleteId = req.params.id;
            const query = {
                _id: ObjectId(deleteId)
            }

            const result = await taskCollections.deleteOne(query);

            return res.send(result);

         });

         // edit task info load 

         app.get('/edit-task/:id',async(req,res)=>{
              const id = req.params.id;
              const query = {
                _id: ObjectId(id)
              }

              const task = await taskCollections.findOne(query);
              return res.send(task)
         });


         // update task

         app.put('/update-task/:id',async(req,res)=>{
            const updateTaskId = req.params.id;
            const taskInfo = req.body;
            const taskNewName = taskInfo.taskName;

            
            const filter = { _id: ObjectId(updateTaskId) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    taskName: taskNewName
                },
              };

            const result = await taskCollections.updateOne(filter,updateDoc,options);
            return res.send(result)
     });



    }
    finally{

    }
}

run().catch(error=>console.log(error));


app.get('/',(req,res)=>{
   return res.send("Server started")
});

app.listen(port,()=>{
    console.log("Server running on port ",port);
})