import express,{Router} from 'express'
import * as urlController from '../Controller/urlcontroller.js'
const urlrouter=Router();

urlrouter.post('/urls',urlController.postcreateshorturl);

urlrouter.get('/urls',urlController.getshorturl);

urlrouter.get('/urls/:code',urlController.geturldetails);

urlrouter.delete('/urls/:code',urlController.deleteurl);

urlrouter.get('/:code',urlController.getredirect);

urlrouter.get('/urls/:code/stats',urlController.getstatsforcode);

urlrouter.get('/urls/:code/qr',urlController.getqrcode);
export default urlrouter;