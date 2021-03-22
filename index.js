import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import admin from './config.js'
import getMediaList from './multimedia.js'
import userRoutes from './routes/userRoutes.js'

const app = express();

app.use(express.json());
dotenv.config();


const firebaseBucket = admin.storage().bucket();
const firebaseDB = admin.firestore();


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }

app.use('/api/users', userRoutes)

app.get('/api/reviews/all', async (req, res) => {
    let reviews = [];
  
    const results = await firebaseDB.collection('reviews').get();
    results.forEach(doc => {
      reviews.push({id: doc.id, data: doc.data()});
    });
  
    let query = req.query;
  
    if(query.organize){
      let key;
      switch(query.organize){
        case 'helpful':
        key = 'helpful';
        break;
  
        case 'recent':
        key = 'timestamp';
        break;
  
        default:
        key = 'timestamp';
      }
      reviews.sort((first,second) => {
        if(first.data[key] > second.data[key]){
          return -1;
        }else if(first.data[key] < second.data[key]){
          return 1;
        }else{
          return 0;
        }
      });
    }
  
    res.status(200).json(reviews);
  });  

app.post('/api/review/new', getMediaList, async (req, res) => {
  const date = new Date();
  const docRef = firebaseDB.collection('reviews').doc(uuidv4());
  await docRef.set({
    ...req.formText,
    helpful: parseInt(req.formText.helpful),
    timestamp: date.toISOString(),
    media: []
  });
  let mediaUrls = [];
  for(let path of req.mediaPaths){
    let currentFile = await new Promise((resolve, reject) => {
      firebaseBucket.upload(path, {public: true}, (err, file, response) => {
        if(err){
          console.log(err);
          return;
        }
        resolve(file);
      });
    });

    mediaUrls.push({
      id: currentFile.id,
      url: currentFile.publicUrl()
    });
  }

  docRef.update({media: [...mediaUrls]});
  for(let path of req.mediaPaths){
    fs.unlink(path, (err) => {
      if(err){
        console.log(err);
      }
    });
  }

  return res.status(201).json({message: 'Review has been created'});
});


app.get('/api/review/:id', async (req, res) => {
  const id = req.params.id;

  if(!id){
    return res.status(403).json({error: 'Unacceptable ID.'});
  }
  const doc = await firebaseDB.collection('reviews').doc(id).get();

  if(!doc.exists){
    return res.status(404).json({error: 'ID not found'});
  }
  return res.status(200).json(doc.data());
});

app.patch('/api/review/:id/helpful', async (req, res) => {
  const id = req.params.id;

  if(!id){
    return res.status(403).json({error: 'Unacceptable ID.'});
  }
  const docRef = firebaseDB.collection('reviews').doc(id);
  const doc = await docRef.get();

  if(!doc.exists){
    return res.status(404).json({error: 'ID not found'});
  }
  const update = await docRef.update({helpful: doc.data().helpful + 1});

  return res.status(200).json({message: 'Your review has been marked helpful'});
});

app.delete('/api/review/:id/delete', async (req, res) => {
  const id = req.params.id;

  if(!id){
    return res.status(403).json({error: 'Unacceptable ID.'});
  }
  const docRef = firebaseDB.collection('reviews').doc(id);
  const doc = await docRef.get();

  if(!doc.exists){
    return res.status(404).json({error: 'ID not found'});
  }

  const data = doc.data();
  for(let mediaObj of data.media){
    let file =  firebaseBucket.file(mediaObj.id);
    try{
      file.delete();
    }catch(err){
      console.log(err);
    }
  }

  const deleteResponse = await docRef.delete();

  return res.status(204).send();
});


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})

