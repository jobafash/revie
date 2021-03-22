import path from 'path'
import formidable from 'formidable'

const __dirname = path.resolve(path.dirname(''));
const form = formidable({
  multiples: true ,
  uploadDir: path.join(__dirname, './uploads'),
  keepExtensions: true,
});
const fieldSet = new Set(['landlord','environment','amenities','name']);

async function getMediaList(req, res, next){
  let mediaPaths = [];
  let [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if(err){
        reject(err);
        return;
      }
      resolve([fields, files]);
    });
  });

  for(let key in files){
    mediaPaths.push(files[key].path);
  }
  if(Object.keys(fields).length !== fieldSet.size){
    res.status(403).send('Invalid number of arguments passed');
    return;
  }
  for(let key in fields){
    if(!fieldSet.has(key)){
      res.status(403).send('Invalid argument key passed');
      return;
    }
  }

  req.mediaPaths = mediaPaths;
  req.formText = {...fields, helpful: 0};
  next();
}

export default getMediaList;
